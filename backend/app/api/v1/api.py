from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, candidates, elections, votes, blockchain, results
from app.api.v1.endpoints.users import list_students
from app.schemas.user import UserResponse
from typing import List

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
api_router.include_router(elections.router, prefix="/elections", tags=["elections"])
api_router.include_router(votes.router, prefix="/votes", tags=["votes"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])
api_router.include_router(results.router, prefix="/results", tags=["results"])

# Explicitly register the admin route to match GET /api/v1/admin/users
admin_router = APIRouter()
admin_router.add_api_route(
    "/users",
    list_students,
    methods=["GET"],
    response_model=List[UserResponse],
    summary="List all registered student users (Admin Only)"
)
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
