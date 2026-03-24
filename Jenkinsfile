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

          stage('Start Infra (Postgres + Redis)') {
              steps {
                  bat 'docker compose down'
                  bat 'docker compose up -d'
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
                    echo Checking if PR already exists...

                    curl -s -H "Authorization: token %GIT_TOKEN%" ^
                    "https://api.github.com/repos/${REPO}/pulls?head=Durvankur-smx:${env.BRANCH_NAME}^&base=develop" ^
                    > pr_check.json

                    findstr "\\"number\\"" pr_check.json >nul

                    IF %ERRORLEVEL%==0 (
                        echo PR already exists. Skipping creation.
                    ) ELSE (
                        echo Creating PR...
                        curl -X POST ^
                        -H "Authorization: token %GIT_TOKEN%" ^
                        -H "Accept: application/vnd.github.v3+json" ^
                        https://api.github.com/repos/${REPO}/pulls ^
                        -d "{\\"title\\":\\"Auto PR: ${env.BRANCH_NAME} to develop\\",\\"head\\":\\"${env.BRANCH_NAME}\\",\\"base\\":\\"develop\\"}"
                    )
                    """
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

            git fetch origin develop:develop

            git checkout develop

            git merge origin/%BRANCH_NAME%

            git push https://%GIT_USER%:%GIT_PASS%@github.com/Durvankur-smx/SMAD-Devops-01.git develop
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
                    echo Checking if develop→main PR exists...

                    curl -s -H "Authorization: token %GIT_TOKEN%" ^
                    "https://api.github.com/repos/${REPO}/pulls?head=Durvankur-smx:develop^&base=main" ^
                    > pr_main_check.json

                    findstr "\\"number\\"" pr_main_check.json >nul

                    IF %ERRORLEVEL%==0 (
                        echo PR already exists. Skipping creation.
                    ) ELSE (
                        echo Creating PR develop → main...
                        curl -X POST ^
                        -H "Authorization: token %GIT_TOKEN%" ^
                        -H "Accept: application/vnd.github.v3+json" ^
                        https://api.github.com/repos/${REPO}/pulls ^
                        -d "{\\"title\\":\\"Auto PR: develop to main\\",\\"head\\":\\"develop\\",\\"base\\":\\"main\\"}"
                    )
                    """
                }
            }
        }
    }
}