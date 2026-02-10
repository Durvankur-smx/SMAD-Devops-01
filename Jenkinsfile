pipeline {
    agent any

    environment {
        REPO = "Durvankur-smx/SMAD-Devops-01"
        TARGET_BRANCH = "develop"
        MAIN_BRANCH = "main"
    }

    stages {

        stage('Confirm Checkout') {
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
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

        stage('Create PR to Develop') {
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
                    passwordVariable: 'GIT_TOKEN'
                )]) {

                    bat """
                    curl -X POST ^
                    -H "Authorization: token %GIT_TOKEN%" ^
                    -H "Accept: application/vnd.github.v3+json" ^
                    https://api.github.com/repos/${REPO}/pulls ^
                    -d "{\\"title\\":\\"Auto PR: %BRANCH_NAME% to develop\\",\\"head\\":\\"%BRANCH_NAME%\\",\\"base\\":\\"develop\\"}"
                    """
                }
            }
        }

        stage('Auto Merge PR to Develop') {
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
                    passwordVariable: 'GIT_TOKEN'
                )]) {

                    bat """
                    curl -X PUT ^
                    -H "Authorization: token %GIT_TOKEN%" ^
                    -H "Accept: application/vnd.github.v3+json" ^
                    https://api.github.com/repos/${REPO}/pulls/1/merge ^
                    -d "{\\"merge_method\\":\\"merge\\"}"
                    """
                }
            }
        }

        stage('Create PR Develop to Main') {
            when {
                branch 'develop'
            }

            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {

                    bat """
                    curl -X POST ^
                    -H "Authorization: token %GIT_TOKEN%" ^
                    -H "Accept: application/vnd.github.v3+json" ^
                    https://api.github.com/repos/${REPO}/pulls ^
                    -d "{\\"title\\":\\"Auto PR: develop to main\\",\\"head\\":\\"develop\\",\\"base\\":\\"main\\"}"
                    """
                }
            }
        }
    }
}
