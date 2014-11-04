</div>
<footer>
<div class="col-md-10">

</div>
<div class="col-md-2 text-right">
</div>
<div class="clear"></div>
</footer>
</div>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="/assets/js/global.js"></script>
<?php
	if(isset($js)){
		foreach($js as $index=>$scriptname){
			echo '<script src="'.$scriptname.'"></script>';	
		}	
	}
?>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-54315bb53d628fde&async=1" async></script>
</body>
</html>
