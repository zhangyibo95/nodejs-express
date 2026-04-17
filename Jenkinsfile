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
                sh '''
                    if [ -f package-lock.json ]; then
                      npm ci
                    else
                      npm install
                    fi
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    TEST_SCRIPT=$(node -p "require('./package.json').scripts && require('./package.json').scripts.test ? require('./package.json').scripts.test : ''")
                    if [ -z "$TEST_SCRIPT" ] || [ "$TEST_SCRIPT" = "echo \\"Error: no test specified\\" && exit 1" ]; then
                      echo "No real test script found, skip"
                    else
                      npm test
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