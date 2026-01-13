import { useEffect, useRef } from 'react';
import { Light } from '@/components/types';

interface DemoAction {
  type: 'toggle' | 'brightness' | 'room_toggle' | 'room_brightness';
  lightId?: string;
  roomName?: string;
  value?: number | boolean;
  timestamp: number;
}

export const useDemoSync = (
  lights: Light[],
  setLights: React.Dispatch<React.SetStateAction<Light[]>>,
  enabled: boolean = false
) => {
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || typeof BroadcastChannel === 'undefined') return;

    if (!isInitialized.current) {
      broadcastChannel.current = new BroadcastChannel('smart_home_demo');
      isInitialized.current = true;

      broadcastChannel.current.onmessage = (event: MessageEvent<DemoAction>) => {
        const action = event.data;
        
        if (Date.now() - action.timestamp > 2000) return;

        switch (action.type) {
          case 'toggle':
            if (action.lightId) {
              setLights(prev => prev.map(light => 
                light.id === action.lightId 
                  ? { ...light, isOn: action.value as boolean }
                  : light
              ));
            }
            break;

          case 'brightness':
            if (action.lightId && typeof action.value === 'number') {
              setLights(prev => prev.map(light => 
                light.id === action.lightId 
                  ? { ...light, brightness: action.value as number }
                  : light
              ));
            }
            break;

          case 'room_toggle':
            if (action.roomName) {
              setLights(prev => prev.map(light => 
                light.room === action.roomName 
                  ? { ...light, isOn: action.value as boolean }
                  : light
              ));
            }
            break;

          case 'room_brightness':
            if (action.roomName && typeof action.value === 'number') {
              setLights(prev => prev.map(light => 
                light.room === action.roomName 
                  ? { ...light, brightness: action.value as number }
                  : light
              ));
            }
            break;
        }
      };
    }

    return () => {
      if (broadcastChannel.current && isInitialized.current) {
        broadcastChannel.current.close();
        broadcastChannel.current = null;
        isInitialized.current = false;
      }
    };
  }, [enabled, setLights]);

  const broadcast = (action: Omit<DemoAction, 'timestamp'>) => {
    if (enabled && broadcastChannel.current) {
      broadcastChannel.current.postMessage({
        ...action,
        timestamp: Date.now()
      });
    }
  };

  return { broadcast };
};
