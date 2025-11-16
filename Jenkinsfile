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
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '') ?: 'dev'
                    echo "Detected branch: ${branchName}"

                    if (branchName == 'dev') {
                        env.PORT = '4200'
                        env.ENV_NAME = 'development'
                        env.CONTAINER_NAME = 'front-dev'
                        env.NETWORK_NAME = 'gestios-gastos-back-dev'
                    } else if (branchName == 'qa') {
                        env.PORT = '4201'
                        env.ENV_NAME = 'qa'
                        env.CONTAINER_NAME = 'front-qa'
                        env.NETWORK_NAME = 'gestios-gastos-back-qa'
                    } else if (branchName == 'main' || branchName == 'master') {
                        env.PORT = '4202'
                        env.ENV_NAME = 'production'
                        env.CONTAINER_NAME = 'front-prod'
                        env.NETWORK_NAME = 'gestios-gastos-back-prod'
                    }
                    echo "Deploying to ${env.ENV_NAME} environment on port ${env.PORT}"
                }
            }
        }

        stage('Build with Docker') {
            steps {
                echo "Building Angular application for ${env.ENV_NAME} environment..."
                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}-${ENV_NAME}:${BUILD_NUMBER} \
                        --build-arg ENV_NAME=${ENV_NAME} .
                    docker tag ${DOCKER_IMAGE}-${ENV_NAME}:${BUILD_NUMBER} ${DOCKER_IMAGE}-${ENV_NAME}:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${env.ENV_NAME} environment..."
                sh '''
                    docker network create ${NETWORK_NAME} || true
                    
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${NETWORK_NAME} \
                        --restart unless-stopped \
                        -p ${PORT}:80 \
                        ${DOCKER_IMAGE}-${ENV_NAME}:${BUILD_NUMBER}
                    
                    sleep 10
                    
                    if docker ps | grep ${CONTAINER_NAME}; then
                        echo "✅ Angular application is running on port ${PORT}"
                    else
                        echo "❌ Failed to start application"
                        docker logs ${CONTAINER_NAME} || true
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker images ${DOCKER_IMAGE}-${ENV_NAME} --format "{{.Tag}}" | \
                grep -E '^[0-9]+$' | sort -rn | tail -n +6 | \
                xargs -r -I {} docker rmi ${DOCKER_IMAGE}-${ENV_NAME}:{} || true
            '''
        }
    }
}