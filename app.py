<<<<<<< HEAD
import os
=======
>>>>>>> parent of 5d844f0... fixed inject
import connexion

from injector import Binder
from flask_injector import FlaskInjector
from connexion.resolver import RestyResolver
<<<<<<< HEAD

from services.elastic import ElasticSearchIndex, ElasticSearchFactory
from conf.elasticsearch_mapper import room_mapping
=======
>>>>>>> parent of 5d844f0... fixed inject

from services.provider import ItemsProvider

# bindings for the Flask Injector
def configure(binder: Binder) -> Binder:
    binder.bind(
<<<<<<< HEAD
        ElasticSearchIndex,
        ElasticSearchIndex(
            ElasticSearchFactory(
                os.environ['ELASTICSEARCH_HOST'],
                os.environ['ELASTICSEARCH_PORT'],
            ),
            'rooms',
            'room',
            room_mapping
        )
=======
        ItemsProvider,
        ItemsProvider([{"Name": "Test 1"}])
>>>>>>> parent of 5d844f0... fixed inject
    )

    return binder


if __name__ == '__main__':
    app = connexion.App(__name__, specification_dir='swagger/')
    app.add_api('my_super_app.yaml', resolver=RestyResolver('api'))
    FlaskInjector(app=app.app, modules=[configure])
    app.run(port=9090)