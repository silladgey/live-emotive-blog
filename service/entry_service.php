<?php
    include "../model/BlogRepository.php";

    $blog = BlogRepository::get_instance();

    function insert_entry_query($c, $e) {
        global $blog;
        echo $blog->create_entry($c, $e);
    }

    if (isset($_REQUEST["c"])) {
        $content = $_REQUEST["c"];
        if (isset($_REQUEST["e"])) {
            $emotion = $_REQUEST["e"];
            insert_entry_query($content, $emotion);
            return null;    
        }
        insert_entry_query($content, null);
        return null;
    }

    echo $blog;
?>
