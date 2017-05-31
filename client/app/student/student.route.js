'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('student', {
    url: '/student',
    template: '<student></student>'
  });
}
