<?php



// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
//this includes the login details
include("config.php");


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}

$email = $_POST['email'];
$fname = $_POST['firstName'];
$lname = $_POST['lastName'];
$jobTitle = $_POST['jobTitle'];
$depID = $_POST['departmentId'];

$check = mysqli_query($conn, "SELECT * from personnel WHERE email='" . $email . "' AND firstName = '" . $fname . "' AND lastName = '" . $lname . "' AND jobTitle = '" . $jobTitle . "' AND departmentID = '" . $depID . "' ");
$count = mysqli_num_rows($check);

if ($count > 0) {
	echo "No changes are made!";
} else {



	$query = $conn->prepare('UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentID=? WHERE id=?');

	$query->bind_param("ssssii", $_POST['firstName'], $_POST['lastName'], $_POST['jobTitle'], $_POST['email'], $_POST['departmentId'], $_POST['id']);

	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);
}
