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
       
    this.models_second = {
    };
     $scope.model = this.models_second;

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

Charger(){
   if (!/json$/.test(this.nameFile)){
    this.nameFile = this.nameFile + ".json";
  }
   this.$http.get('./storage/'+this.nameFile)
      .then(res => {
        console.log(res.data.test);
        console.log(res.data.etudiants);
        if( res.data.version == 1){
          this.ChargerVersion();
          console.log("version");
        }
        else {
          this.ChargerFichier();
          console.log("fichier");
        }
  });
}  

ChargerFichierbis(){
  if (!/json$/.test(this.nameFile)){
    this.nameFile = this.nameFile + ".json";
  }
   this.$http.get('./storage/'+this.nameFile)
      .then(response => {
      this.awesomeStudent = response.data.etudiants;
      this.awesomeChoice = response.data.Choix;
      this.onglet="valide";
  });
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
			
      
      this.$scope.data.version = 1;
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
      var testici = window.URL.createObjectURL(blob);
      console.log("1");
          downloadLink.attr('href',testici);
           console.log("2");
                      //  downloadLink.attr('href',window.URL.createObjectURL(blob));
                        downloadLink.attr('download', nom_du_fichier);
                         console.log("3");
			downloadLink[0].click();
      console.log("4");

      console.log(blob);
      this.nameFile = nom_du_fichier;
      var aide_file = [blob];
       console.log("5");
      var fichier = new File(aide_file , nom_du_fichier);
      console.log(fichier);
       console.log("6");
      this.Upload.upload({
        url: 'api/things/upload',
        data: { file: fichier }
      })

		};
    
    fcttest(param1){
      param1.test = param1.test + 1;
      console.log("pourquoi ?");
    }

  ChargerFichier() {
    if (!/json$/.test(this.nameFile)) {
      this.nameFile = this.nameFile + ".json";
    }
    this.$http.get('./storage/' + this.nameFile)
      .then(response => {
        this.awesomeStudent = response.data.etudiants; // ensemble des étudiants du fichier
        this.awesomeChoice = response.data.Choix; //  ensemble des choix avec leur options
        this.models.lists = {};
        this.models_second.lists = {};
        console.log(this.awesomeChoice);
        
        for (var i = 0; i<this.awesomeChoice.length; ++i){ // pour tout les choix
          var provisoire = this.awesomeChoice[i].nom; // on met le nom du choix dans une variable
          var id = this.awesomeChoice[i].id; // on met l id du choix 
          console.log(provisoire);
          var container = { bids :{
            people:[]
          },
          argument : {
            people : []
          },
          preference : {
            people : []
          },
          dictator : {
            people :[]
          }
        };
        
        for( var w = 0 ; w<this.awesomeChoice[i].options.length; w++){
           this.awesomeChoice[i].options[w].containers = {};
           this.awesomeChoice[i].options[w].containers = container;

        }
          this.models.lists[provisoire] = {allowedTypes:[provisoire],people:[]}; // on ajoute le choix en entré en disant que seul les individus du meme type peuvent venir, choix = parcours, module un etc
          this.models_second.lists[provisoire] = {allowedTypes: [provisoire],people: [], choice : this.awesomeChoice[i].options}; // on fait la meme chose dans la liste de droite
          for (var j = 0; j<this.awesomeStudent.length; ++j){ // pour tout les étudiants on va recuperer les valeurs pour chaque options.
            var provisoire_consultation = []; 
            for (var w = 0; w<this.awesomeStudent[j].consultation.length; ++w){
              if (this.awesomeStudent[j].consultation[w].id_choix ==  id ){
                  provisoire_consultation.push(this.awesomeStudent[j].consultation[w])
              }
            }
            this.models.lists[provisoire].people.push({nom : this.awesomeStudent[j].nom,test: 1, prenom : this.awesomeStudent[j].prenom , type : provisoire , consultation : provisoire_consultation});
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

