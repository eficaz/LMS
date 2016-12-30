angular.module('starter.controllers', ['starter.services', 'ngOpenFB'])

  .config(function ($sceProvider) {

  $sceProvider.enabled(false);

})

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup, $state, $rootScope, ngFB, $http) {

  // Form data for the login modal
  $scope.loginData = {};

  ///////////login section--------------------------------------------
  $scope.login = function(user) 
  {
    var config = {
      headers : {
     'Content-Type': 'application/x-www-form-urlencoded' 
      } }

    //////////////Api to login user////////////////////////////////////////
    $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/check_login_user', {uname: user.username,password: user.password}, config)
    .success(function (data, status, headers, config) 
    {       
        if(data.status!="invalid user"){

          var uid= data.user_details.USERID;          
          $rootScope.errmsg="";
          $rootScope.uname=user.username;
          localStorage.setItem("cloudUser",$rootScope.uname);
          localStorage.setItem("cloudUserID",uid);

          $state.go('app.dashboard', {}, {reload: true});

        }
        else
        {
           $rootScope.errmsg="invalid user";
        }

    })
    .error(function (data, status, header, config) {
          alert("Invalid");
           
        });

		
	};

	///-------------fb login/////////////////////////////////
	$scope.fbLogin = function () {
    ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
                
                //localStorage.setItem("cloudUser",$rootScope.uname);
            } else {
                alert('Facebook login failed');
            }
        });
	};

///-------------fb login end///////////////////////////////


  //-------------logout -------------------------------
  $scope.logout = function() { 
  window.localStorage.clear();
  window.localStorage.removeItem("cloudUser");

   $location.path('/app/login');   
};
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Warning Message',
		 template: msg
	   });
	 };
  //--------------------------------------------
})

 //////////////Controller for signup////////////////////////////////////////
.controller('signupCtrl', function($scope , Profiles) {

	$scope.data = {};
	$scope.createUser = function(signupForm){
	    if (signupForm.$valid) {
	        var newEmail = $scope.data.email;
	        var newPassword = $scope.data.password;
	        var newFullName = $scope.data.fullName;
	        var selectedPlan = $state.params.pId;
	 
	        AuthService.signupEmail(newEmail, newPassword, newFullName, selectedPlan);
	    };
};
   
})

 //////////////Profile view controller////////////////////////////////////////
.controller('ProfilesCtrl', function($scope , Profiles) {
    $scope.profiles = Profiles.all();
})

.controller('ProfileCtrl', function($scope, $stateParams , Profiles) {
	$scope.profile = Profiles.get($stateParams.profileId);
})

//////////////Interview list controller////////////////////////////////////////
.controller('InterviewCtrl', function($scope, $stateParams , Profiles, $http ,$location, $rootScope, $cordovaFileTransfer, $ionicHistory,$ionicPopup) {

    
    
    $scope.names= [];
    var config = {
          headers : {
               'Content-Type': 'application/x-www-form-urlencoded' 
          }
        }
        var id= localStorage.getItem("cloudUserID");

        //////////////API to get all courses under a institute////////////////////////////////////////
        $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/get_all_courses', {USERID: localStorage.getItem("cloudUserID"),inst_id: localStorage.getItem("selCourse")}, config)
        .success(function (data, status, headers, config) 
        {
            
            angular.forEach(data, function(value, key) {

            if(data.status!="No course")
            {
              
              $scope.showMe=1;
              if(value.status!="Completed" && value.status !="Pending")
              {
                $scope.names.push(value);
                $scope.baseurl="http://www.eficaztechsol.com/ednts/";
              }
              if(value.status!="Started" )
              {
                
                $scope.toggleText="Start Assessment";
              }
              else
              {
                
                $scope.toggleText="Continue";
              }
            }
            else
            {
              $scope.showMe=0;
            }

              
      });
   
     

      })


     //////////////History//////////////////
      
      $scope.myGoBack = function() {
        $ionicHistory.goBack();
      }
      

      ///////////course detail/////////////////////
      $scope.coursedetail = function(id){
       
      // $rootScope.uname=localStorage.getItem("cloudUser");

       $rootScope.results = [];
      
    
       angular.forEach($scope.names, function(value, key) {
        
       angular.forEach(value, function(value1, key1) {
        
       if (value[key1] == id) {
          
          $rootScope.interview_setID=value.interview_set_id;
          $rootScope.schedule_setID=value.schedule_send_candidate_id;
          $rootScope.cat_id=value.cat_id;
          $rootScope.results.push(value); 
          $location.path('/app/coursedetail');

        }
          
        });
       
      });

      }

      ////////////////////////////////

      //////////////Start assessment//////////////////
      
      $scope.startass = function() {
      
       $rootScope.startDate=new Date();
       $location.path('/app/questions');
      }



     
})


//////////////Question controller////////////////////////////////////////
.controller('QuestionCtrl', function($scope, $stateParams , Profiles, $http ,$location, $rootScope, $cordovaFileTransfer, $ionicHistory,$ionicPopup) {

  
   
    $scope.$watch('btndisable',function(){

      
      if(!angular.isUndefined($scope.btndisable))
    {
      $scope.btn_text_visible=1;
    }
   else
   {
    $scope.btn_text_visible=0;
   }
    })
    
    $scope.btn_text_visible=0;
    $scope.btn_text="Confirm";
    $scope.btn_text1="Finish";
    $scope.indexToShow = 0;
    $scope.names= [];
   
    var config = {
          headers : {
               'Content-Type': 'application/x-www-form-urlencoded' 
          }
        }
    //////////////API to start an assessment////////////////////////////////////////
    $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/get_start', {USERID: localStorage.getItem("cloudUserID"),inst_id: localStorage.getItem("selCourse"),course_id: $rootScope.cat_id,interview_set_id: $rootScope.interview_setID,schedule_send_candidate_id: $rootScope.schedule_setID}, config)
    .success(function (data, status, headers, config) 
     {
        
        angular.forEach(data, function(value, key) {
        
        $rootScope.interview_set_questions_id = value.interview_set_questions_id;
        $rootScope.attend_interview_id = value.attend_interview_id;
        $rootScope.time_elapse = value.time_elapse;
        $rootScope.startdate = value.start_date;

        var time= $rootScope.time_elapse;       
       
        $scope.names.push(value);

      });
   
     $scope.totindex = $scope.names.length;

      })
    ///////////////timer function to check the time//////////////
    $scope.Timerenable=true;
    $scope.timeend =function()
    {
       var config = {
          headers : {
               'Content-Type': 'application/x-www-form-urlencoded' 
          }
        }
      $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/time_closed', {USERID: localStorage.getItem("cloudUserID"),schedule_send_candidate_id: $rootScope.schedule_setID,'attend_interview_id': $rootScope.attend_interview_id}, config)
      .success(function (data, status, headers, config) 
       {
          if(data.status=="success")
          {
            $scope.indexToShow=$scope.totindex;
            $scope.indexToShow=--$scope.indexToShow;
            ///////ALERT/////////////
              var alertPopup = $ionicPopup.alert({
               title: 'WARNING!',
               template: 'Time up!'
             });
             alertPopup.then(function(res) {
               $scope.Timerenable=false;
               $location.path('/app/dashboard');
             });




           // $scope.Timerenable=false;
           // $location.path('/app/dashboard');
          }
       })
        
    }
    ////////////////////function to finish an assessment///////////////////////////////
    $scope.finish = function(){

         $scope.btn_text1='Submitting';
         
         // Destination URL 
          var url = "http://www.eficaztechsol.com/ednts/api_ionic/api_functions/save_answer";
           // var url = "http://eficaztechsol.com/ionic/upload.php";        
           $scope.upldfile=document.getElementById('sample').value; 
           
           var targetPath = $scope.upldfile;
         
           // File name only
           var filename = targetPath.split("/").pop();
           
           var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "video/mp4",
                params : {'fileName':filename, 'USERID': localStorage.getItem("cloudUserID"),'inst_id': localStorage.getItem("selCourse"),'course_id': $rootScope.cat_id,'interview_set_id': $rootScope.interview_setID,'interview_set_questions_id': $rootScope.interview_set_questions_id,'attend_interview_id': $rootScope.attend_interview_id,'status':1 }
               //params : {'directory':'ionic', 'fileName':filename}
            };

            /////////////////////file transfering to server/////////////////////////////    
            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {

                ///////ALERT/////////////
                var alertPopup = $ionicPopup.alert({
                 title: 'SUCCESS!',
                 template: 'JSON.stringify(result.response)'
                 });
                 alertPopup.then(function(res) {
                   console.log('');
                 });

                
                console.log("SUCCESS: " + JSON.stringify(result.response));
                $scope.btn_text1='Finish';
                $scope.btndisable==undefined;
                if($scope.indexToShow + 1<$scope.names.length)
                  {

                    $scope.indexToShow = ($scope.indexToShow + 1);

                  }
                  ///////ALERT/////////////
                  var alertPopup = $ionicPopup.alert({
                   title: 'SUCCESS!',
                   template: 'Thank you for completing the course.'
                   });
                   alertPopup.then(function(res) {
                     console.log('');
                   });
                  

                  $location.path('/app/interviews');

            }, function (err) {

               alert(JSON.stringify(err));
               console.log("ERROR: " + JSON.stringify(err));

            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });
        
        
        

    };

    //////////////function to keep the dropdown value in dropdown////////////////////////
     $scope.change = function(){

        
        //$scope.indexToShow = ($scope.indexToShow + 1) % $scope.names.length;
        if($scope.indexToShow + 1<$scope.names.length)
        {

          $scope.indexToShow = ($scope.indexToShow + 1);

        }


    };


    /////////////////Skip a question//////////////////////
    $scope.skip = function(){
         
      var confirmPopup = $ionicPopup.confirm({
      title: 'Skip Question',
      template: 'Are you sure you want to skip this question?'
        });
      confirmPopup.then(function(res) {
      if(res) {
         var config = {
          headers : {
             'Content-Type': 'application/x-www-form-urlencoded' 
          }
         }
      //////////////////API to skip a question/////////////////////////////
      $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/save_skip_status', {USERID: localStorage.getItem("cloudUserID"),inst_id: localStorage.getItem("selCourse"),course_id: $rootScope.cat_id,interview_set_id: $rootScope.interview_setID,interview_set_questions_id: $rootScope.interview_set_questions_id,attend_interview_id: $rootScope.attend_interview_id}, config)
      .success(function (data, status, headers, config) 
       {
          if(data.status=='success')
          {
                if($scope.indexToShow + 1<$scope.names.length);
           {

             $scope.indexToShow = ($scope.indexToShow + 1);

           }
          }
       })
         
       } else {
         
         
       }
      });

         

    }


    ////////////////////video capture////////////////////////////


        $scope.videoCapture = function () {

           var options = {
              limit: 1,
              duration: 10
           };

           navigator.device.capture.captureVideo(onSuccess, onError, options);

           function onSuccess(mediaFiles) {
              var i, path, len;
            
              for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                 path = mediaFiles[i].fullPath;
                 document.getElementById('sample').value=path;
                $scope.btndisable=path;

                 //document.getElementById('vdocntr').src=
                 var video = document.getElementById('vdocntr');
                 var source = document.createElement('source');


                  source.setAttribute('src', document.getElementById('sample').value);

                 
                  video.appendChild(source);
                  video.play();

                 console.log(mediaFiles);
              }
           }

           function onError(error) {
              navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
           }
          
        }


        $scope.FileUpload = function () {
        
          $scope.btn_text='Submitting';
        
          
           $scope.btn_text_visible=1;
          // Destination URL 
          var url = "http://www.eficaztechsol.com/ednts/api_ionic/api_functions/save_answer";
                 
           $scope.upldfile=document.getElementById('sample').value; 
          
           
           var targetPath = $scope.upldfile;
         
           // File name only
           var filename = targetPath.split("/").pop();
            
           var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "video/mp4",
                params : {'fileName':filename, 'USERID': localStorage.getItem("cloudUserID"),'inst_id': localStorage.getItem("selCourse"),'course_id': $rootScope.cat_id,'interview_set_id': $rootScope.interview_setID,'interview_set_questions_id': $rootScope.interview_set_questions_id,'attend_interview_id': $rootScope.attend_interview_id,'status':0 }
               
            };

                 
            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {

                
                console.log("SUCCESS: " + JSON.stringify(result.response));
                $scope.btn_text='Confirm';
                $scope.btndisable==undefined;
                if($scope.indexToShow + 1<$scope.names.length)
                  {

                    $scope.indexToShow = ($scope.indexToShow + 1);

                  }

            }, function (err) {

             
               console.log("ERROR: " + JSON.stringify(err));

            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });

            //$scope.indexToShow = ($scope.indexToShow + 1) % $scope.names.length;
        
      }

})




.controller('DashCtrl', function($scope, $stateParams , Profiles, $http ,$location, $rootScope, $cordovaFileTransfer) {
	
	    $scope.names= [];

      $http.get("http://eficaztechsol.com/ionic/customers.php")
      .success(function (response) 
      {
      	
		    angular.forEach(response, function(value, key) {
		    $scope.names.push(value);

		    });
       
    
     
       //$scope.names = response;
       $scope.results = [];
       if($stateParams.id!=null)
       {
       		angular.forEach($scope.names, function(value, key) {
	    	
	    	  angular.forEach(value, function(value1, key1) {
	    	
	    	  if (value[key1] == $stateParams.id) {
	    	      	
	          $scope.results.push(value);

	      	}
	    		
	    	 });
	     
	       });
       }

      })

      ////////////////////////////////
      

      ///////////video detail/////////////////////
      $scope.interview = function(){
        
        $location.path('/app/interviews');

       
        }
        ////////////////////////////////

      ///////////video detail/////////////////////
      $scope.reply = function(id){
        
        if (id != null) {

        	$rootScope.videoid=id;
        	
        	$location.path('/app/reply/'+id);


            //$location.path('/app/reply/?param=value'); 
        }
      }


      /////////////reply for video////////////////////////
		
      $scope.answer = function(){


      $rootScope.uname=localStorage.getItem("cloudUser");

       $scope.results = [];
  		
	 	   ////////////////find each 
	     angular.forEach($scope.names, function(value, key) {
	    	
	    	angular.forEach(value, function(value1, key1) {
	    	
	    	if (value[key1] == $stateParams.id) {
	    	      	
	        $scope.results.push(value);
	      }
	    		
	    	});
	     
	    });
 	     
      }

      ////////////////////video capture////////////////////////////


        $scope.videoCapture = function () {


           var options = {
              limit: 1,
              duration: 10
           };

           navigator.device.capture.captureVideo(onSuccess, onError, options);

           function onSuccess(mediaFiles) {
              var i, path, len;
            
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
             path = mediaFiles[i].fullPath;
             document.getElementById('sample').value=path;
              
             var video = document.getElementById('vdocntr');
             var source = document.createElement('source');

              source.setAttribute('src', document.getElementById('sample').value);

              video.appendChild(source);
              video.play();

                 console.log(mediaFiles);
              }
           }

           function onError(error) {
              navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
           }
          
        }


        $scope.FileUpload = function () {
        
        
         // Destination URL 
          var url = "http://eficaztechsol.com/ionic/upload.php";
         
         
           $scope.upldfile=document.getElementById('sample').value; 
           //document.getElementById('vdocntr').src=
           var video = document.getElementById('vdocntr');
           var source = document.createElement('source');

            source.setAttribute('src', document.getElementById('sample').value);

            video.appendChild(source);
            video.play();

           var targetPath = $scope.upldfile;
           // File name only
           var filename = targetPath.split("/").pop();
          
           var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "video/mp4",
                params : {'directory':'ionic', 'fileName':filename}
            };

                 
            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
             alert(JSON.stringify(result.response));
                console.log("SUCCESS: " + JSON.stringify(result.response));
            }, function (err) {
              alert(JSON.stringify(err));
                console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
                // PROGRESS HANDLING GOES HERE
            });
       }



  })


//////////////////Dashboard controller
.controller('DashboardCtrl', function($scope, $stateParams , Profiles, $http ,$location, $rootScope, $cordovaFileTransfer, $ionicHistory,$filter) {



    $scope.courseList=[];
    $scope.selectedTestAccount = null;
    $scope.testAccounts = [];

    $scope.getdash = function() {

    var config = {
      headers : {
           'Content-Type': 'application/x-www-form-urlencoded' 
      }
    }
    var id= localStorage.getItem("cloudUserID");
    ////////////////api to find institute list in dashboard///////////////////
    $http.post('http://www.eficaztechsol.com/ednts/api_ionic/api_functions/get_inst_list', {USERID: id}, config)
    .success(function (data, status, headers, config) {
        $scope.testAccounts = data;
        var courseList1 = localStorage.getItem("selCourse");
        var single_object = $filter('filter')($scope.testAccounts , function (d) {return d.inst_id ==  localStorage.getItem("selCourse");})[0];
  
        if(!angular.isUndefined(single_object))
          $scope.courseList=single_object;


        });
      }
      

      ////////////storing value of dropdown selection////////////////////
      $scope.setCourse = function(ans) {
      $scope.msg = "";
         if(!angular.isUndefined(ans))
        localStorage.setItem("selCourse",ans.inst_id);
      else
        localStorage.setItem("selCourse",'');
        
       
      }

  //////////////redirection to interview section////////////////////////////////////////
  $scope.gotoInterview = function(ans) {
   if(ans== undefined)
   {
     $scope.msg = 'Please Select a Institute';
   }
   else
   {
    
   
   
    if (ans.inst_id != "" && ans.inst_id != undefined)
    {
      
     // $scope.msg = 'Selected Value: '+$scope.courseList;
      $location.path('/app/interviews');
    }
    else
    {
      
      
      $scope.msg = 'Please Select a Institute';
    }
                 
   }
         
  }


  


});



