(function() {
	'use strict';

	angular
		.module(
			'starter', [
				'controllers',
				'ionic',
				'nmn',
			]
		)
		.config(config)
		.run(run)

	;

	function config(
		$stateProvider,
		$urlRouterProvider
	) {
		$stateProvider
			.state('sideMenu', {
				abstract: true,
				controller: 'SideMenu as vm',
				templateUrl: 'templates/sideMenu.html',
				url: '',
			})
			.state('sideMenu.test', {
				url: '/test',
				views: {
					menuContent: {
						controller: 'Test as vm',
						templateUrl: 'templates/test.html',
					},
				},
			})

		;

		$urlRouterProvider.otherwise('/test');
	}

	function run(
		nmn,
		$ionicPlatform
	) {
		$ionicPlatform.ready(
			function() {
				window.nmn = nmn;
			}
		);
	}
}());
