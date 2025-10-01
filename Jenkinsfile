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
                        env.ENV_NAME = 'dev'
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
                        env.ENV_NAME = 'dev'
                        env.CONTAINER_NAME = 'gestion-gastos-dev'
                    }
                    echo "Deploying to ${env.ENV_NAME} environment on port ${env.PORT}"
                }
            }
        }

        stage('Build with Docker') {
            steps {
                echo 'Building Angular application with Docker...'
                script {
                    docker.build("${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER}")
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
                    echo "${env.ENV_NAME} deployment available at: http://localhost:${env.PORT}"
                }
            }
        }
        failure {
            echo 'Pipeline failed!'
            script {
                if (env.CONTAINER_NAME) {
                    sh '''
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    '''
                }
            }
        }
        always {
            script {
                if (env.ENV_NAME) {
                    sh '''
                        docker images ${DOCKER_IMAGE}-${ENV_NAME} --format "table {{.Tag}}" | tail -n +2 | sort -nr | tail -n +6 | xargs -r docker rmi ${DOCKER_IMAGE}-${ENV_NAME}: || true
                    '''
                }
            }
        }
    }
}

// Función reutilizable para despliegue
def deployToEnvironment() {
    // Stop and remove existing container
    sh '''
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
    '''

    // Run new container
    sh '''
        docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${PORT}:4200 \
            ${DOCKER_IMAGE}-${ENV_NAME}:${BUILD_NUMBER}
    '''

    // Wait and check if the service is running
    sh '''
        sleep 10
        if docker ps | grep ${CONTAINER_NAME}; then
            echo "Angular server is running on port ${PORT}"
        else
            echo "Failed to start Angular server"
            exit 1
        fi
    '''
}