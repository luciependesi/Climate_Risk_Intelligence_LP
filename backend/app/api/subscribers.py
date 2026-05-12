# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
from fastapi import APIRouter
from ..models.schemas import User, Cluster

router = APIRouter(prefix="/subscriber", tags=["subscriber"])


@router.get("/{subscriber_id}", response_model=User)
def get_subscriber(subscriber_id: int):
    # MERGE EXISTING LOGIC HERE if you already have subscriber models
    return User(name="Lucie", email="lucie@example.com", role="Engineer")


@router.get("/{subscriber_id}/clusters", response_model=list[Cluster])
def get_clusters(subscriber_id: int):
    # MERGE EXISTING CLUSTER LOGIC HERE
    return []