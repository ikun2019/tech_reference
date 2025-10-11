pipeline {
  agent any

  environment {
    REGISTORY = "docker.io/ikun2019"
    STACK_NAME = "techreference"
    DOCKER_COMPOSE_FILE = "docker-stack.yml"
    DOCKER_CLI_EXPERIMENTAL = "enabled"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/ikun2019/tech_reference.git',
            credentialsId: 'github-token'
      }
    }
    stage('Build & Push Docker Images') {
      steps {
        script {
          def services = ['client', 'gateway', 'content-api_service', 'content-sync_service', 'coupon_service']
          for (service in services){
            sh """
              echo "✅ Building image for ${service}..."
              docker build -f ${service}/Dockerfile.prod -t ${REGISTORY}/${service}:latest ${serivce}
              docker push ${REGISTORY}/${service}:latest
            """
          }
        }
      }
    }
    stage('Deploy to Docker Swarm') {
      steps {
        script {
          edho "✅ Deploying stack ${STACK_NAME}"
          sh """
            docker stack deploy -c ${DOCKER_COMPOSE_FILE} ${STACK_NAME}
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deployment successful!"
      sh 'docker service ls'
    }
    failure {
      echo "❌ Build or deploy failed."
    }
  }
}