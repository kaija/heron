Heron
=====

Heron is a fast key / value REST API web service.
It's based on Redis database and node.js.

Example:

* Insert a id with value 12345

curl http://localhost:9999/heron/v1/insert -d "id=kaija&val=12345"

* query all timestamp with a id

curl --dump-header - "http://localhost:9999/heron/v1/query_id?id=kaija"

* query a value of a timestamp

curl --dump-header - "http://localhost:9999/heron/v1/query_id_key?id=kaija&time=1374503768033"

* delete a timestam value

curl -i -X DELETE --dump-header - "http://localhost:9999/heron/v1/delete_id_key?id=kaija&time=1374503768033"

* delete all timestamp value with a id

curl -i -X DELETE --dump-header - "http://localhost:9999/heron/v1/delete_id?id=kaija"

