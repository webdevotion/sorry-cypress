import { useSwitch } from '@src/hooks/useSwitch';
import { shortEnglishHumanizer } from '@src/lib/utis';
import {
  Alert,
  Button,
  Cell,
  Grid,
  Heading,
  HFlow,
  Icon,
  useCss,
} from 'bold-ui';
import React from 'react';
import {
  InstanceScreeshot,
  InstanceTestV5,
  TestAttempt,
} from '../../../generated/graphql';
import { Screenshot, TestError } from './common';

const TestAttemptView = ({
  attempt,
  screenshot,
  title,
}: {
  title: string;
  attempt: TestAttempt;
  screenshot: Partial<InstanceScreeshot>;
}) => {
  const [open, toggleOpen] = useSwitch(true);

  return (
    <Grid>
      <Cell xs={12}>
        <HFlow>
          {attempt.state !== 'passed' && (
            <Button
              kind="normal"
              onClick={() => toggleOpen()}
              size="small"
              skin="ghost"
            >
              <Icon icon={open ? 'minus' : 'plus'} size={1.5} />
            </Button>
          )}
          <Heading level={2}>{title}</Heading>
        </HFlow>
      </Cell>
      {open && (
        <>
          <Cell xs={12}>
            {attempt.error && (
              <TestError
                error={attempt.error.message}
                stack={attempt.error.stack}
              />
            )}
          </Cell>
          <Cell xs={12}>
            <Screenshot screenshot={screenshot} />
          </Cell>
        </>
      )}
    </Grid>
  );
};

export const TestDetailsV5 = ({
  test,
  screenshots,
}: {
  test: InstanceTestV5;
  screenshots: Partial<InstanceScreeshot>[];
}) => {
  const { css } = useCss();
  return (
    <>
      <div
        className={css`
          padding: 32px;
        `}
      >
        {test.state === 'passed' && (
          <Alert type="success">Test has passed!</Alert>
        )}
        {test.displayError && <TestError error={test.displayError} />}
      </div>
      {test.attempts.map((attempt, index, all) => (
        <TestAttemptView
          key={index}
          title={`Attempt ${index + 1} of ${
            all.length
          } - ${shortEnglishHumanizer(attempt.wallClockDuration)}`}
          attempt={attempt}
          screenshot={screenshots[index]}
        />
      ))}
    </>
  );
};
