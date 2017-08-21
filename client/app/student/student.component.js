import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './student.route';

export class StudentController {
  awesomeStudent = [];
  awesomeChoice = [];
  newThing = '';
  onglet = 'student';

  /*@ngInject*/
  constructor($http, $scope, socket, Upload,$rootScope) {
    this.$http = $http;
    this.socket = socket;
    this.$scope = $scope;
    this.$rootScope = $rootScope; 
    this.Upload = Upload;
    this.onglet = "";
    this.nameFile = this.$rootScope.file_name ;
    this.$rootScope.file_name =this.nameFile  ;
    
    

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

 /* $onInit() {

   this.$http.get('./storage/exemple.json')
      .then(response => {
      this.awesomeStudent = response.data.etudiants;
      console.log(this.awesomeStudent);
  });
}*/


addFile(){
   console.log(this.file);
   if(/json$/.test(this.file.name)){
        this.nameFile = this.file.name;
        this.Upload.upload({
          url :'api/things/upload',
          data : {file : this.file}
        }).then(this.ChargerFichier());
}
else {
  alert("ce n'est pas un fichier json");
}
}



ChargerFichier(){
 
  if (!/json$/.test(this.nameFile)){
    this.nameFile = this.nameFile + ".json";
  }
  this.$rootScope.file_name = this.nameFile;
   this.$http.get('./storage/'+this.nameFile)
      .then(response => {
      this.awesomeStudent = response.data.etudiants;
      this.awesomeChoice = response.data.Choix;
      this.onglet="valide";
  });
}


}



export default angular.module('miuapsbisApp.student', [uiRouter])
  .config(routing)
  .component('student', {
    template: require('./student.html'),
    controller: StudentController
  })
  .name;
