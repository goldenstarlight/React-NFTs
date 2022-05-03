import { Box, Text } from 'grommet';
import * as React from 'react';
import './ToggleSwitch.css';

const { useEffect, useState } = React;

export interface ToggleSwitchProps {
  choiceA: string;
  choiceB: string;
  defaultSelected?: string;
  handler?(selected: string): void;
}

const ToggleSwitch = ({ choiceA, choiceB, defaultSelected, handler }: ToggleSwitchProps) => {
  const [selected, setSelected] = useState(defaultSelected || choiceA);

  useEffect(() => {
    if (handler) {
      handler(selected);
    }
  }, [handler, selected]);

  const getToggleColor = (currency: string) => (selected === currency ? 'clrToggleOnText' : 'clrToggleOffText');

  return (
    <Box
      round={true}
      width="small"
      direction="row"
      background={{ color: '#131A33' }}
      border={{ color: 'clrToggleBg', size: '3px' }}
      className="toggle-box"
    >
      <Box
        round={true}
        width="xsmall"
        pad="xxsmall"
        height="100%"
        className="toggle-active"
        style={selected === choiceA ? { left: 0 } : { left: '100%', transform: 'translatex(-100%)' }}
      />
      <Box
        round={true}
        focusIndicator={false}
        onClick={() => setSelected(choiceA)}
        justify="center"
        align="center"
        width="xsmall"
        pad="xxsmall"
      >
        <Text
          className={selected != choiceA ? 'toggle-hover-label toggle-label' : 'toggle-label'}
          color={getToggleColor(choiceB)}
        >
          {choiceA}
        </Text>
      </Box>
      <Box
        round={true}
        focusIndicator={false}
        onClick={() => setSelected(choiceB)}
        justify="center"
        align="center"
        width="xsmall"
        pad="xxsmall"
      >
        <Text
          className={selected != choiceB ? 'toggle-hover-label toggle-label' : 'toggle-label'}
          color={getToggleColor(choiceA)}
        >
          {choiceB}
        </Text>
      </Box>
    </Box>
  );
};

export default ToggleSwitch;
