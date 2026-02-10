pipeline {
    agent any

    stages {

        stage('Confirm Checkout') {
            steps {
                echo 'Repo pulled successfully'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
    }
}
