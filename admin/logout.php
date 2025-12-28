<?php
session_start();
session_destroy();
echo "<meta http-equiv='refresh' content='0;url=/admin/login.php'>";
echo "<script>window.location.href='/admin/login.php';</script>";
exit;
