<?php
    include "../model/BlogRepository.php";

    $blog = BlogRepository::get_instance();

    function insert_entry_query($content, $emotion) {
        global $blog;
        echo $blog->create_entry($content, $emotion);
    }

    if (isset($_REQUEST["c"]) && isset($_REQUEST["e"])) {
        $content = $_REQUEST["c"];
        $emotion = $_REQUEST["e"];
        insert_entry_query($content, $emotion);
        return null;
    }

    echo $blog;
?>
