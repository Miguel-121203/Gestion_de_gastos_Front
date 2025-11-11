pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'gestion-gastos'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Set Environment Variables') {
            steps {
                script {
                    // Get current branch name
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '') ?: 'dev'
                    echo "Detected branch: ${branchName}"

                    if (branchName == 'dev') {
                        env.PORT = '4200'
                        env.ENV_NAME = 'development'
                        env.CONTAINER_NAME = 'gestion-gastos-dev'
                    } else if (branchName == 'qa') {
                        env.PORT = '4201'
                        env.ENV_NAME = 'qa'
                        env.CONTAINER_NAME = 'gestion-gastos-qa'
                    } else if (branchName == 'main' || branchName == 'master') {
                        env.PORT = '4202'
                        env.ENV_NAME = 'production'
                        env.CONTAINER_NAME = 'gestion-gastos-prod'
                    } else {
                        // Default to dev environment for other branches
                        env.PORT = '4200'
                        env.ENV_NAME = 'development'
                        env.CONTAINER_NAME = 'gestion-gastos-dev'
                    }
                    echo "Deploying to ${env.ENV_NAME} environment on port ${env.PORT}"
                }
            }
        }

        stage('Build with Docker') {
            steps {
                echo "Building Angular application for ${env.ENV_NAME} environment..."
                script {
                    docker.build(
                        "${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER}",
                        "--build-arg ENV_NAME=${env.ENV_NAME} ."
                    )
                    // Tag as latest for this environment
                    sh "docker tag ${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER} ${DOCKER_IMAGE}-${env.ENV_NAME}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${env.ENV_NAME} environment..."
                script {
                    deployToEnvironment()
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            script {
                if (env.PORT) {
                    echo "✅ ${env.ENV_NAME} deployment available at: http://localhost:${env.PORT}"
                    echo "Container name: ${env.CONTAINER_NAME}"
                    echo "Image: ${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER}"
                }
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                if (env.CONTAINER_NAME) {
                    sh """
                        docker stop ${env.CONTAINER_NAME} || true
                        docker rm ${env.CONTAINER_NAME} || true
                    """
                }
            }
        }
        always {
            script {
                // Clean up old images (keep last 5 builds)
                if (env.ENV_NAME) {
                    sh """
                        docker images ${DOCKER_IMAGE}-${env.ENV_NAME} --format '{{.Tag}}' | \
                        grep -E '^[0-9]+\$' | sort -rn | tail -n +6 | \
                        xargs -r -I {} docker rmi ${DOCKER_IMAGE}-${env.ENV_NAME}:{} || true
                    """
                }
            }
        }
    }
}

// Función reutilizable para despliegue
def deployToEnvironment() {
    // Stop and remove existing container
    sh """
        docker stop ${env.CONTAINER_NAME} || true
        docker rm ${env.CONTAINER_NAME} || true
    """

    // Run new container
    sh """
        docker run -d \
            --name ${env.CONTAINER_NAME} \
            --restart unless-stopped \
            -p ${env.PORT}:80 \
            ${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER}
    """

    // Wait and check if the service is running
    sh """
        echo "Waiting for container to start..."
        sleep 10
        
        if docker ps | grep ${env.CONTAINER_NAME}; then
            echo "✅ Angular application is running on port ${env.PORT}"
            echo "Health check URL: http://localhost:${env.PORT}"
            
            # Wait for health check to pass
            for i in 1 2 3 4 5; do
                if curl -f http://localhost:${env.PORT} > /dev/null 2>&1; then
                    echo "✅ Health check passed"
                    exit 0
                fi
                echo "Waiting for application to be ready (attempt \$i/5)..."
                sleep 5
            done
            
            echo "⚠️ Warning: Application started but health check did not pass"
        else
            echo "❌ Failed to start Angular application"
            docker logs ${env.CONTAINER_NAME} || true
            exit 1
        fi
    """
}
