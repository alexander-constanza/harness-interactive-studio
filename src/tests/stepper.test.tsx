import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinearStepper } from '../components/LinearStepper';

describe('LinearStepper Component', () => {
  it('renders stages accurately and highlights active stage', () => {
    const handleSelect = vi.fn();
    render(
      <LinearStepper
        currentStage="spec"
        status="idle"
        hasActiveQuestion={false}
        onSelectStage={handleSelect}
      />
    );

    expect(screen.getByText('Task Specification')).toBeInTheDocument();
    expect(screen.getByText('Advisor Plan')).toBeInTheDocument();
    expect(screen.getByText('Focused Execution')).toBeInTheDocument();
    expect(screen.getByText('Review & Verify')).toBeInTheDocument();
  });

  it('renders decision intercept stage when active question is present', () => {
    const handleSelect = vi.fn();
    render(
      <LinearStepper
        currentStage="guidance"
        status="needs_guidance"
        hasActiveQuestion={true}
        onSelectStage={handleSelect}
      />
    );

    expect(screen.getByText('Decision Intercept')).toBeInTheDocument();
  });

  it('invokes stage selection callback on click', () => {
    const handleSelect = vi.fn();
    render(
      <LinearStepper
        currentStage="advisor"
        status="idle"
        hasActiveQuestion={false}
        onSelectStage={handleSelect}
      />
    );

    fireEvent.click(screen.getByText('Task Specification'));
    expect(handleSelect).toHaveBeenCalledWith('spec');
  });
});
