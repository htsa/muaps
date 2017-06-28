import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './request.route';

export class RequestController {
  awesomeStudent = [];
  awesomeChoice = [];
  newThing = '';
  onglet = 'student';
  student = {
    selected: null,
    lists: { "student1": [], "student2": [] }
  };

  /*@ngInject*/
  constructor($http, $scope, socket, Upload) {
    this.$http = $http;
    this.socket = socket;
    this.$scope = $scope;
    this.Upload = Upload;
    this.onglet = "student";
     this.models = {
        
       // lists: {"A": [], "B": [],"C":[]}
       
    };
    $scope.model = this.models;

    this.models_second = {

    };

    /* this.model = {
       dropzone : {
       }
     }
    */
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch('model', function (model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);
  }

  /* $onInit() {
 
    this.$http.get('./storage/exemple.json')
       .then(response => {
       this.awesomeStudent = response.data.etudiants;
       console.log(this.awesomeStudent);
   });
 }*/

  addFile() {

    if (/json$/.test(this.file.name)) {
      this.nameFile = this.file.name;
      this.Upload.upload({
        url: 'api/things/upload',
        data: { file: this.file }
      }).then(this.ChargerFichier());
    }
    else {
      alert("ce n'est pas un fichier json");
    }
  }



  ChargerFichier() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/' + this.nameFile)
      .then(response => {
        this.awesomeStudent = response.data.etudiants;
        this.awesomeChoice = response.data.Choix;
        this.models.lists = {};
        this.models_second.lists = {};
        console.log(this.awesomeChoice);
        
        for (var i = 0; i<this.awesomeChoice.length; ++i){
          var provisoire = this.awesomeChoice[i].nom;
          var id = this.awesomeChoice[i].id;
          console.log(provisoire);
          this.models.lists[provisoire] = {allowedTypes:[provisoire],people:[]};
          this.models_second.lists[provisoire] = {allowedTypes: [provisoire],people: []};
          for (var j = 0; j<this.awesomeStudent.length; ++j){
            var provisoire_consultation = [];
            for (var w = 0; w<this.awesomeStudent[j].consultation.length; ++w){
              if (this.awesomeStudent[j].consultation[w].id_choix ==  id ){
                  provisoire_consultation.push(this.awesomeStudent[j].consultation[w])
              }
            }
            this.models.lists[provisoire].people.push({nom : this.awesomeStudent[j].nom, prenom : this.awesomeStudent[j].prenom , type : provisoire , consultation : provisoire_consultation});
          }
        }
/*
        this.models.lists.A = {allowedTypes: ["a"],people:[]};
        this.models.lists.B = {allowedTypes: ["b"],people:[]};
        this.models.lists.C = {allowedTypes: ["c"],people:[]};
         for (var i = 0; i < this.awesomeStudent.length; ++i) {
        this.models.lists.A.people.push({nom : this.awesomeStudent[i].nom, prenom : this.awesomeStudent[i].prenom , type : "a"});
        this.models.lists.B.people.push({nom : this.awesomeStudent[i].nom, prenom : this.awesomeStudent[i].prenom , type : "b"});
        this.models.lists.C.people.push({nom : this.awesomeStudent[i].nom, prenom : this.awesomeStudent[i].prenom , type : "c"});
    }*/
        console.log(this.models_second);
       /*  this.student.lists.student1 = this.awesomeStudent;
        this.student.lists.student2 = response.data.etudiants;
        for (var i = 0; i < this.awesomeChoice.length; i++) {
          this.model.dropzone.this.awesomeChoice[i].name = [];

        }
        console.log(this.awesomeChoice);
        for (var i = 0; i < this.awesomeChoice.length; i++) {

          var test = this.awesomeChoice[i].nom;
          var tout = this.awesomeChoice[i].options;
          this.model.dropzone[test] = [];
          this.model.dropzone[test].push({ label: test, allowedTypes: ["container"], choix: [] });
          for (var j = 0; j < tout.length; j++) {
            var testbis = tout[j].nom;
            console.log("on passe dans a premiere boucle");
            var merde = this.model.dropzone[test];
            console.log(this.model.dropzone[test][0].choix);
            // this.model.dropzone[test].push({type: "container", nom : testbis, allowedTypes:["container"]});
            this.model.dropzone[test][0].choix.push({ nom: testbis, type: "container" });
            console.log("on passe ds la deuxieme boucle");


            console.log(this.model.dropzone[test]);
          }

          console.log(test);



        }
        this.modelsecond.student = response.data.etudiants;
        */
      });
  }



}



export default angular.module('miuapsbisApp.request', [uiRouter])
  .config(routing)
  .component('request', {
    template: require('./request.html'),
    controller: RequestController
  })
  .name;

