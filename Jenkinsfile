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
                    bat 'npm install'
                }
            }
        }

        stage('Build Project') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }
}
