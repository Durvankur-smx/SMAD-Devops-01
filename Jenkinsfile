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

        stage('Run Tests') {
            steps {
                dir('frontend') {
                    bat 'npm test'
                }
            }
        }

        stage('Auto Merge to develop') {
            when {
                allOf {
                    not { branch 'develop' }
                    not { branch 'main' }
                }
            }

            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {

                    bat """
                    git config user.email "jenkins@ci.com"
                    git config user.name "jenkins"

                    git fetch origin
                    git checkout develop
                    git merge origin/%BRANCH_NAME%
                    git push https://%GIT_USER%:%GIT_PASS%@github.com/Durvankur-smx/SMAD-Devops-01.git develop
                    """
                }
            }
        }

    }
}
