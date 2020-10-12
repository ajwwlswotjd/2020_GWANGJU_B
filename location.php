<?php
session_start();
/*
comment: 호출 카운트가 짝수면 2초 대기 후 실행, 홀수이면 바로 실행
*/

/* 출력 메시지 */
$msg = "";

/* 세션 존재 비교 */
if(isset($_SESSION['locationCnt']))
{
	/* 세션이 존재할 경우 */
	$locationCnt = $_SESSION['locationCnt'];
	$locationCnt++; 
	$locationCnt = $_SESSION['locationCnt'] = $locationCnt;
}
else 
{
	/* 세션이 존재하지 않을 경우*/
    $locationCnt = $_SESSION['locationCnt'] = 0;
}

/* 카운트 수 비교 */
if($locationCnt % 2 == 0)
{
	/* 짝수 호출 일 때 */
	sleep(3);
	$msg .=  "3초가 지난 후 실행되었습니다.<br />";
}

$msg .= "이 페이지는 찾아오시는 길 페이지 입니다. <button onclick=\"window.location(-1);\">이전</button>";
?>
<!DOCTYPE html>
<html lang="ko" xml:lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<?php echo $msg; ?>
</body>
</html>