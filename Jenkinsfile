pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh '''
                    if npm run | grep -q " test"; then
                      npm test
                    else
                      echo "No test script found, skip"
                    fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh 'sudo /usr/local/bin/deploy_express.sh ${WORKSPACE}'
            }
        }
    }

    post {
        success {
            echo 'Express deploy success'
        }
        failure {
            echo 'Express deploy failed'
        }
    }
}