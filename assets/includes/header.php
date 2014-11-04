<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Hack4theArts Lafayette</title>
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"/>
		<?php
		if (isset($css)) {
			foreach ($css as $index => $cssname) {
				echo '<link rel="stylesheet" href="' . $cssname . '"/>';
			}
		}
		?>

		<link rel="stylesheet" href="/assets/css/global.css"/>
		<link rel="stylesheet" href="/assets/css/media.css"/>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<!--[if lt IE 9]>
		<script src="/assets/js/html5shiv.js"></script>
		<script src="/assets/js/respond.min.js"></script>
		<![endif]-->
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>

	<body>
		<a href="#main" class="element-invisible">Skip to main content</a>
		<div class="container-fluid">
			
			<nav class="navbar navbar-default navbar-static-top" role="navigation">
				<div class="navbar-header">
					<h1 style="display:inline;padding-left:20px;">Arts Lafayette</h1>
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
				</div>
				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
					<li><a href="/">Home</a></li>
					
					<li><a href="about.php">About</a></li>
					</ul>
				</div>

			</nav>
		</div>
		<div class="container" id="main">
