Heron
=====

Heron is a fast key / value REST API web service.
It's based on Redis database and node.js.

[website]

Example:

* Insert a id with value 12345

curl http://localhost/heron/v1/insert -d "id=kaija&val=12345"


* Insert a id with value 12345 and custom key 987654

curl http://localhost/heron/v1/insert -d "id=kaija&key=987654&val=12345"


* query all timestamp with a id

curl --dump-header - "http://localhost/heron/v1/query_id?id=kaija"

* query all key value with a id

curl --dump-header - "http://localhost/heron/v1/query_id_all?id=kaija"

* query a value of a timestamp

curl --dump-header - "http://localhost/heron/v1/query_id_key?id=kaija&key=1374503768033"

* delete a timestam value

curl -i -X DELETE --dump-header - "http://localhost/heron/v1/delete_id_key?id=kaija&key=1374503768033"

* delete all timestamp value with a id

curl -i -X DELETE --dump-header - "http://localhost/heron/v1/delete_id?id=kaija"


[website]: https://github.com/kaija/heron
