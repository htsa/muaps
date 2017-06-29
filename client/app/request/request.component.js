import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './request.route';

export class RequestController {
  awesomeStudent = ["etudiant"];
  

  /*@ngInject*/
  constructor($http, $scope, socket, Upload) {
    this.$scope = $scope;
    this.$http = $http;
    this.socket = socket;
    this.$scope = $scope;
    this.Upload = Upload;
    this.awesomeChoice = [];
    this.onglet = "general";
     this.models = {
    };
        $scope.model = this.models;
    this.models_second = {
    };

    $scope.data = {
      test : "blabla",
      student : this.awesomeStudent,
      choice : this.awesomeChoice,
      liste_gauche : this.models,
      liste_droite : this.models_second,
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch('model', function (model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);
  }



  addFile() {

    if (/json$/.test(this.file.name)) {
      this.nameFile = this.file.name;
      this.Upload.upload({
        url: 'api/things/upload',
        data: { file: this.file }
      }).then(this.ChargerVersion());
    }
    else {
      alert("ce n'est pas un fichier json");
    }
  }

  ChargerVersion(){
     if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/'+ this.nameFile).then(response =>{
      this.awesomeStudent = response.data.student;
      this.awesomeChoice = response.data.choice;
      this.models = response.data.liste_gauche;
      this.models_second = response.data.liste_droite;
    })
  }

  saveJSON = function () {
			
      console.log(this.nameFileOut);
      this.$scope.data.choice = this.awesomeChoice;
      this.$scope.data.student = this.awesomeStudent;
      this.$scope.data.liste_gauche = this.models;
      this.$scope.data.liste_droite = this.models_second;
			var bla = angular.toJson(this.$scope.data);
      if (this.nameFileOut ==undefined){
        alert("tu n'as pas renseigne le nom d'un fichier");
        return
      }
      var nom_du_fichier = this.nameFileOut + '.json';
			var blob = new Blob([bla], { type:"application/json;charset=utf-8;" });			
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
                        downloadLink.attr('download', nom_du_fichier);
			downloadLink[0].click();
		};

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

