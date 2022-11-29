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
            $emotion_name = $row["name"];
            $return_arr[] = array(
                "id" => $emotion_id,
                "name" => $emotion_name
            );
        }
        
        echo json_encode($return_arr);
        $mysqli->close();
    }

    function insert_emotion_query($name, $image) {
        $mysqli = connect_db();
        $query = <<<INSERT_QUERY
            INSERT INTO emotive_blog_emotion (`name`)
            VALUES ('$name');
        INSERT_QUERY;

        if ($image) {
            $query = <<<INSERT_QUERY
                INSERT INTO emotive_blog_emotion (`name`, `image`)
                VALUES ('$name', '$image');
            INSERT_QUERY;
        }
        
        $result = $mysqli->query($query);
        $mysqli->close();
    }

    if (isset($_REQUEST["n"]) && isset($_REQUEST["i"])) {
        $name = $_REQUEST["n"];
        $image = $_REQUEST["i"];
        insert_emotion_query($name, $image);
        return null;
    }

    select_emotions_query();
?>
