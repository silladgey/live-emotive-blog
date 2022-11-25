<?php
    class BlogEntry {
        protected $id;
        protected $content;
        protected $dt;
        protected $emotion;

        public function __construct($id, $content, $datetime) {
            if (!empty($id) && is_numeric($id)) {
                $this->id = $id;
            }
            if (!empty($content)) {
                $this->content = $content;
            }
            $this->dt = $datetime;
            $this->emotion = array_fill(0, 2, null);
        }

        public function get_id() {
            return $this->id;
        }

        public function get_content() {
            return $this->content;
        }

        public function set_content($content) {
            $this->content = $content;
        }

        public function get_datetime() {
            return $this->dt;
        }

        public function &get_emotion_array() {
            return $this->emotion;
        }

        public function add_emotion($emotion) {
            if (!empty($emotion)) {
                $this->get_emotion_array()["emotion"] = $emotion;
                return true;
            }
            return false;
        }

        public function get_emotion() {
            $emotion_arr = $this->get_emotion_array();
            if (!is_null($emotion_arr) && array_key_exists("emotion", $emotion_arr)) {
                return $emotion_arr["emotion"];
            }
            return null;
        }

        public function add_emotion_image_url($emotion_image_url) {
            if (!empty($emotion_image_url)) {
                $this->get_emotion_array()["emotionImg"] = $emotion_image_url;
                return true;
            }
            return false;
        }

        public function get_emotion_image_url() {
            $emotion_arr = $this->get_emotion_array();
            if (!is_null($emotion_arr) && array_key_exists("emotionImg", $emotion_arr)) {
                return $emotion_arr["emotionImg"];
            }
        }
    }
?>
