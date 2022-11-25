<?php
    include "../db/db_config.php";
    
    function select_emotions_query() {
        $mysqli = connect_db();
        $query = <<<SELECT_QUERY
            SELECT * FROM emotive_blog_emotion;
        SELECT_QUERY;
        $result = $mysqli->query($query);
        $return_arr = array();
    
        while ($row = $result->fetch_array()){
            $emotion_id = $row["id"];
            $emotion = $row["emotion"];
            $return_arr[] = array(
                "id" => $emotion_id,
                "emotion" => $emotion
            );
        }
        
        echo json_encode($return_arr);
        $mysqli->close();
    }

    select_emotions_query();
?>
