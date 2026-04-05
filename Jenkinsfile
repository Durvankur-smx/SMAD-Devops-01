pipeline {
    agent any

    environment {
        REPO = "Durvankur-smx/SMAD-Devops-01"
        TARGET_BRANCH = "develop"
        MAIN_BRANCH = "main"
         CURRENT_BRANCH = ""
    }

    stages {

        stage('Confirm Checkout') {
    steps {
        script {
            env.CURRENT_BRANCH = powershell(
                script: '(git rev-parse --abbrev-ref HEAD).Trim()',
                returnStdout: true
            ).trim()

            echo "Branch: ${env.CURRENT_BRANCH}"
        }
    }
}

         

        stage('Start Infra (Postgres + Redis)') {
         steps {
        bat 'docker compose -f docker-compose.yml down'
        bat 'docker compose -f docker-compose.yml up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                bat 'docker ps'
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
                    "https://api.github.com/repos/${REPO}/pulls?head=Durvankur-smx:${env.CURRENT_BRANCH}^&base=develop" ^
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
                        -d "{\\"title\\":\\"Auto PR: ${env.CURRENT_BRANCH} to develop\\",\\"head\\":\\"${env.CURRENT_BRANCH}\\",\\"base\\":\\"develop\\"}"
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

    post {
        always {
            bat 'docker compose down'
        }
    }
}