# Import all the models, so that Base has them before being
# imported by Alembic or database creation scripts
from app.database.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.candidate import Candidate  # noqa
from app.models.election import Election  # noqa
