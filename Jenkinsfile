pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'  // Make sure to have NodeJS plugin installed and this version configured in Jenkins
    }

    environment {
        // Environment variables
        ENV = 'staging'
        BASE_URL = credentials('playwright-base-url')
        TEST_USERNAME = credentials('playwright-username')
        TEST_PASSWORD = credentials('playwright-password')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'  // Uses package-lock.json for deterministic installs
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium'  // Install only Chromium for CI
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        // Run Playwright tests with additional options
                        sh '''
                            npx playwright test \\
                                --project=chromium \\
                                --reporter=list,html \\
                                --workers=2
                        '''
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error("Test execution failed: ${e.message}")
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive test results and artifacts
            archiveArtifacts artifacts: 'reports/test-results/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports/test-results',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                reportTitles: ''
            ])

            // Clean up workspace
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true
            )
        }

        success {
            echo 'All tests passed successfully!'
        }

        failure {
            echo 'Tests failed! Check the test report for details.'
        }
    }
}