pipeline {
 agent none
 parameters {
    string(name: 'ECRURL', defaultValue: '445343419895.dkr.ecr.ap-south-1.amazonaws.com', description: 'Please Enter your Docker ECR REGISTRY URL without https?')
    string(name: 'APPREPO', defaultValue: 'wezvatechfrontend', description: 'Please Enter your Docker App Repo Name:TAG?')
    string(name: 'REGION', defaultValue: 'ap-south-1', description: 'Please Enter your AWS Region?') 
 }


 stages{
    stage('Checkout')
    {
      agent { label 'demo' }
      steps {
        git branch: 'main', credentialsId: 'GithubCred', url: 'https://github.com/Karnamakshay/Build-Frontend-NodeJS.git'
      }
     } 

    stage('Build-UnitTest')
    {
      agent { label 'demo' }
      steps {
            echo "Building Node Express ..."
            sh "npm install sonar-scanner"
            catchError(buildResult: 'SUCCESS', message: 'UNIT TEST FAILED') {
              sh "npm test"
            }
       }
    }


       stage('Build Image')
       {
           agent { label 'demo' }
           steps{
             script {
                                  // Prepare the Tag name for the Image
                       AppTag = params.APPREPO + ":node-rel" + env.BUILD_ID
                                  // Docker login needs https appended
                       ECR = "https://" + params.ECRURL
                       docker.withRegistry( ECR, 'ecr:ap-south-1:AWSCred' ) {
                                  // Build Docker Image locally
                           myImage = docker.build(AppTag)
                                 // Push the Image to the Registry 
                           myImage.push()
                       } 
             }
           }
       }

     stage ('Scan Image')
     {
        agent { label 'demo' }
	steps {
           echo "Scanning Image for Vulnerabilities"
           sh "trivy image --offline-scan  ${params.APPREPO}:node${env.BUILD_ID} > trivyresults.txt"

           echo "Analyze Dockerfile for best practices ..."
           sh "docker run --rm -i hadolint/hadolint < Dockerfile | tee -a dockerlinter.log"
	}
	post {
          always {
	    sh "docker rmi ${params.APPREPO}:node${env.BUILD_ID}"
	   }
        }
   }


 }
}
