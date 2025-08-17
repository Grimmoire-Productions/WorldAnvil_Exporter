import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ExportToolContainer from '../../containers/ExportToolContainer/ExportToolContainer';
import { WorldContext } from '../../context/WorldContext';
import type { WorldContextType } from '../../utils/types';

function ExportPage() {
  const { worldId } = useParams<{ worldId?: string }>();
  const { selectedWorld } = React.useContext(WorldContext) as WorldContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (worldId && !selectedWorld) {
      // worldId will be handled by MainHeader which reads from params
    }
  }, [worldId, selectedWorld]);

  useEffect(() => {
    if (selectedWorld?.id && selectedWorld.id !== worldId) {
      // Update URL when world changes
      navigate(`/${selectedWorld.id}/export`, { replace: true });
    }
  }, [selectedWorld, worldId, navigate]);

  return <ExportToolContainer />;
}

export default ExportPage;