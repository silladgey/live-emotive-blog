<?php
    include "../db_config.php";
    include "BlogEntry.php";

    class BlogRepository {
        private static $instance = null;
        protected $mysqli = null;
        protected $entries = null;

        private function __construct() {
            $this->mysqli = connect_db();
            $this->entries = array();
            $this->populate_from_db();
        }

        public function __toString() {
            $sliced_entries = array_slice($this->get_entries(), 0 , 20);
            $return_arr = array();
            foreach ($sliced_entries as $entry) {
                $return_arr[] = $this->jsonify($entry);
            }
            return json_encode($return_arr);
        }

        public static function get_instance() {
            if (self::$instance == null) {
                self::$instance = new BlogRepository();
            }
            return self::$instance;
        }

        public static function jsonify($entry) {
            return array(
                "id" => $entry->get_id(),
                "content" => $entry->get_content(),
                "datetime" => $entry->get_datetime(),
                "emotionImg" => $entry->get_emotion_image_url(),
                "emotion" => $entry->get_emotion()
            );
        }

        public function &get_entries() {
            return $this->entries;
        }

        public function add_to_array($entry) {
            if (!is_null($entry)) {
                $this->entries[] = $entry;
                return true;
            }
            return false;
        }

        public function entry_object($data) {
            // instantiate an entry object
            $entry_id = $data["id"];
            $entry_content = $data["content"];
            $entry_datetime = $data["date_time"];
            $entry_emotion = $data["emotion"];
            $entry_emotion_image = $data["image"];
            $entry = new BlogEntry($entry_id, $entry_content, $entry_datetime);
            if ($entry_emotion) {
                $entry->add_emotion($entry_emotion);
            }
            if ($entry_emotion_image) {
                $entry->add_emotion_image_url($entry_emotion_image);
            }
            return $entry;
        }

        public function populate_from_db() {
            // select entries from database
            $query = <<<SELECT_QUERY
                SELECT `entry`.`id`, `entry`.`content`, `entry`.`date_time`, `emotion`.`image`, `emotion`.`emotion`
                FROM `emotive_blog_entry` AS `entry`
                LEFT JOIN `emotive_blog_emotion` AS `emotion`
                ON `emotion`.`id`=`entry`.`emotion_id`
                ORDER BY `entry`.`date_time` DESC;
            SELECT_QUERY;
            $result = $this->mysqli->query($query);

            if (!$result->num_rows) {
                return false;
            }
            
            // add entries to array
            while ($row = $result->fetch_array()){
                $entry = $this->entry_object($row);
                $this->add_to_array($entry);
            }
            return true;
        }

        public function create_entry($content, $emotion) {
            // TODO validate parameters

            // insert entry to database
            $content = $this->mysqli->real_escape_string($content);
            $emotion = $this->mysqli->real_escape_string($emotion);

            $query = <<<INSERT_QUERY
                INSERT INTO `emotive_blog_entry` (`content`)
                VALUES ('$content');
                INSERT_QUERY;

            if ($emotion) {
                $query = <<<INSERT_QUERY
                    INSERT INTO `emotive_blog_entry` (`content`, `emotion_id`)
                    VALUES ('$content', '$emotion');
                    INSERT_QUERY;
            }

            $result = $this->mysqli->query($query);
            $last_id = $this->mysqli->insert_id;
            $entry = $this->select_entry($last_id);
            return json_encode($this->jsonify($entry));
        }

        public function select_entry($id) {
            // select an entry from database
            $query = <<<SELECT_QUERY
                SELECT `entry`.`id`, `entry`.`content`, `entry`.`date_time`, `emotion`.`image`, `emotion`.`emotion`
                FROM `emotive_blog_entry` AS `entry`
                LEFT JOIN `emotive_blog_emotion` AS `emotion`
                ON `emotion`.`id`=`entry`.`emotion_id`
                WHERE `entry`.`id`='$id';
            SELECT_QUERY;

            $result = $this->mysqli->query($query);
            $entry = $this->entry_object($result->fetch_assoc());
            $this->add_to_array($entry);
            return $entry;
        }

        public function get_entry_by_id($id) {
            if (!empty($id) && is_numeric($id) && !is_null($this->get_entries())) {
                foreach ($this->get_entries() as $entry) {
                    if ($entry->get_id() == $id) {
                        return $entry;
                    }
                }
            }
            return null;
        }

        public function add_emotion_to_entry($id, $emotion) {
            if (!empty($id) && is_numeric($id) && !empty($emotion) && !is_null($this->get_entries())) {
                $entry = $this->get_entry_by_id($id);
                return $entry->add_emotion($emotion);
            }
            return false;
        }

        public function add_emotion_image_url_to_entry($id, $emotion_img_url) {
            if (!empty($id) && is_numeric($id) && !empty($emotion_img_url) && !is_null($this->get_entries())) {
                $entry = $this->get_entry_by_id($id);
                return $entry->add_emotion_image_url($emotion_img_url);
            }
            return false;
        }
    }
?>
