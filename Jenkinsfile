#!/bin/bash +x

pipeline {
    agent none

    stages {
        stage('Init'){
            agent any
            steps {
                echo 'Init'
                echo '******************************'
            }
        }
        stage('Build images') {
            agent any
            steps {
                echo 'Build images'
                sh '. ./build.sh'
                echo '******************************'
            }
        }
        stage('Deployment') {
            agent any
            steps {
                echo 'Deployment'
                sh '. ./deploy.sh'
                echo '******************************'
            }
        }
    }
}