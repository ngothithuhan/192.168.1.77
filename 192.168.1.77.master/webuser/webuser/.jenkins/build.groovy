#!groovy

/*
The MIT License
Copyright (c) 2015-, CloudBees, Inc., and a number of other of contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

node {

  currentBuild.result = "SUCCESS"

  withEnv(["PATH+NODE=${tool name: 'node 6.11.1 pipeline', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {

    try {

      stage('Checkout'){

        checkout scm
      }

      stage('Test'){

        env.NODE_ENV = "test"

        print "Environment will be : ${env.NODE_ENV}"

        sh 'node -v'
        sh 'npm prune'
        sh 'npm install'
        sh 'npm test'

      }

      stage('build-image'){
        sh 'chmod +775 .docker/build.sh'
        sh '.docker/build.sh'
      }

    }
    catch (err) {

      currentBuild.result = "FAILURE"

      throw err
    }
  }
}
