pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PORT = '4200'
        ENV = 'dev'
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application...'
                sh 'npm run build'
            }
        }

        stage('Deploy Dev') {
            when {
                branch 'dev'
            }
            steps {
                echo 'Deploying to development environment...'
                script {
                    // Stop any existing development server
                    sh '''
                        pkill -f "ng serve" || true
                        sleep 2
                    '''

                    // Start the development server in background
                    sh '''
                        nohup npm run start -- --host 0.0.0.0 --port ${PORT} --disable-host-check > /tmp/angular-dev.log 2>&1 &
                        echo $! > /tmp/angular-dev.pid
                    '''

                    // Wait and check if the service is running
                    sh '''
                        sleep 10
                        if netstat -tuln | grep :${PORT}; then
                            echo "Angular dev server is running on port ${PORT}"
                        else
                            echo "Failed to start Angular dev server"
                            exit 1
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            script {
                if (env.BRANCH_NAME == 'dev') {
                    echo "Development deployment available at: http://localhost:${PORT}"
                }
            }
        }
        failure {
            echo 'Pipeline failed!'
            script {
                // Stop the dev server if deployment failed
                sh '''
                    if [ -f /tmp/angular-dev.pid ]; then
                        kill $(cat /tmp/angular-dev.pid) || true
                        rm -f /tmp/angular-dev.pid
                    fi
                '''
            }
        }
    }
}