/**
 * WellnessGPT macOS Window Animation Controller
 * Sequence:
 *  0. Chat Intro -> User types "Hi", AI types "Hi [USER], how may I help you?"
 *  1. Transition -> Chat bubbles fade out, macOS window slides up
 *  2. Screen 1 -> Stream AI agent telemetry files (conversations.json, agent_events.json, etc.)
 *  3. Transition -> Screen 1 exits, Screen 2 (AI Intelligence Pipeline) enters
 *  4. Screen 2 -> 6 Pipeline steps execute sequentially, progress bar reaches 100%
 */

document.addEventListener('DOMContentLoaded', () => {
  // Chat Intro Elements
  const chatIntroContainer = document.getElementById('chat-intro-container');
  const chatUserRow = document.getElementById('chat-user-row');
  const chatUserText = document.getElementById('chat-user-text');
  const chatUserCaret = document.getElementById('chat-user-caret');
  const chatAiRow = document.getElementById('chat-ai-row');
  const chatTypingDots = document.getElementById('chat-typing-dots');
  const chatAiText = document.getElementById('chat-ai-text');
  const chatAiCaret = document.getElementById('chat-ai-caret');

  // macOS Window Elements
  const macosWindow = document.getElementById('macos-window');
  const macosTitle = document.getElementById('macos-title');
  const macosBody = document.getElementById('macos-body');
  const stageUpload = document.getElementById('stage-upload');
  const stageDashboard = document.getElementById('stage-dashboard');
  const stageVisualize = document.getElementById('stage-visualize');
  const simMousePointer = document.getElementById('sim-mouse-pointer');

  // Screen 1: Auto-Fetch Elements
  const fetchBarFill = document.getElementById('fetch-bar-fill');
  const fetchPercent = document.getElementById('fetch-percent');
  const fetchStatusText = document.getElementById('fetch-status-text');
  
  // Screen 2: Pipeline Elements
  const pipeStepBadge = document.getElementById('pipe-step-badge');
  const pipeBarFill = document.getElementById('pipe-bar-fill');
  const pipeActionRow = document.getElementById('pipe-action-row');
  const btnVisualizeData = document.getElementById('btn-visualize-data');

  let currentAnimationId = 0;

  // Helper sleep
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Typewriter effect function
  async function typeWriter(element, text, speed = 45, animId) {
    if (!element) return;
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (animId !== undefined && animId !== currentAnimationId) return;
      element.textContent += text[i];
      await wait(speed);
    }
  }

  // Reset to Initial State
  function resetAll() {
    // Chat Intro Reset
    if (chatIntroContainer) {
      chatIntroContainer.className = 'chat-intro-container';
      chatUserRow.className = 'chat-bubble-row user-row';
      chatAiRow.className = 'chat-bubble-row ai-row';
      chatUserText.textContent = '';
      chatAiText.textContent = '';
      chatTypingDots.style.display = 'inline-flex';
      chatUserCaret.style.display = 'inline-block';
      chatAiCaret.style.display = 'none';
    }

    // Window Reset
    macosWindow.className = 'macos-window';
    if (macosTitle) macosTitle.textContent = 'HeyDoc - AI Agent Data Ingestion';

    // Screens
    stageUpload.className = 'stage-screen stage-upload active';
    stageDashboard.className = 'stage-screen stage-dashboard';
    if (stageVisualize) stageVisualize.className = 'stage-screen stage-visualize';

    // Cursor Reset
    if (simMousePointer) {
      simMousePointer.style.transition = 'none';
      simMousePointer.style.opacity = '0';
      simMousePointer.style.transform = 'translate(-40px, 300px)';
      simMousePointer.classList.remove('clicking');
    }
    if (btnVisualizeData) {
      btnVisualizeData.classList.remove('sim-hover', 'sim-clicked');
    }

    // Screen 1 Reset
    if (fetchBarFill) fetchBarFill.style.width = '0%';
    if (fetchPercent) fetchPercent.textContent = '0%';
    if (fetchStatusText) fetchStatusText.textContent = 'Connecting to AI agent telemetry streams...';

    for (let i = 1; i <= 4; i++) {
      const fileItem = document.getElementById(`file-item-${i}`);
      const fileState = document.getElementById(`file-state-${i}`);
      if (fileItem) fileItem.className = 'arriving-file-item';
      if (fileState) {
        fileState.className = 'file-state-pill';
        fileState.textContent = 'Waiting...';
      }
    }

    // Screen 2 Pipeline Reset
    if (pipeStepBadge) {
      pipeStepBadge.className = 'pipe-step-badge';
      pipeStepBadge.textContent = 'Running · step 1 of 6';
    }
    if (pipeBarFill) pipeBarFill.style.width = '0%';
    if (pipeActionRow) pipeActionRow.classList.remove('visible');

    for (let i = 1; i <= 6; i++) {
      const stepItem = document.getElementById(`pipe-step-${i}`);
      const icon = document.getElementById(`pipe-icon-${i}`);
      const status = document.getElementById(`pipe-status-${i}`);
      if (stepItem) stepItem.className = 'pipe-step-item';
      if (icon) {
        icon.className = 'pipe-status-icon';
        icon.textContent = '◯';
      }
      if (status) {
        status.className = 'pipe-step-status';
        status.textContent = 'Queued';
      }
    }

    // Screen 3 Reset
    const kpi1 = document.getElementById('kpi-val-1');
    const kpi2 = document.getElementById('kpi-val-2');
    const kpi3 = document.getElementById('kpi-val-3');
    const kpi4 = document.getElementById('kpi-val-4');
    if (kpi1) kpi1.textContent = '0.0M';
    if (kpi2) kpi2.textContent = '0';
    if (kpi3) kpi3.textContent = '0.0%';
    if (kpi4) kpi4.textContent = '0.0s';

    const chartLine = document.getElementById('chart-line-path');
    if (chartLine) {
      chartLine.style.animation = 'none';
    }
  }

  // Helper: Live Number Count-up Animation
  function animateCount(elem, targetVal, suffix, decimals, duration, animId) {
    if (!elem) return;
    const startTime = performance.now();
    function update(now) {
      if (animId !== undefined && animId !== currentAnimationId) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = (ease * targetVal).toFixed(decimals);
      elem.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        elem.textContent = (targetVal % 1 === 0 && decimals === 0 ? targetVal : targetVal.toFixed(decimals)) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // Master Animation Sequence
  async function runAnimationSequence() {
    const animId = ++currentAnimationId;
    resetAll();

    const isCurrent = () => currentAnimationId === animId;
    const waitStep = async (ms) => {
      await wait(ms);
      return isCurrent();
    };

    if (!await waitStep(400)) return;

    // ========================================================
    // PHASE 0: Chat Conversation Interaction
    // ========================================================
    
    // 1. User Message arrives & types "Hi"
    chatUserRow.classList.add('visible');
    if (!await waitStep(350)) return;
    await typeWriter(chatUserText, 'Hi', 90, animId);
    if (!isCurrent()) return;
    if (!await waitStep(400)) return;
    chatUserCaret.style.display = 'none';

    if (!await waitStep(300)) return;

    // 2. AI row appears with 3 pulsing typing dots
    chatAiRow.classList.add('visible');
    chatTypingDots.style.display = 'inline-flex';
    if (!await waitStep(950)) return;

    // 3. AI typing dots hide, AI message types out
    chatTypingDots.style.display = 'none';
    chatAiCaret.style.display = 'inline-block';
    await typeWriter(chatAiText, 'Hi [USER], how may I help you?', 45, animId);
    if (!isCurrent()) return;
    if (!await waitStep(600)) return;
    chatAiCaret.style.display = 'none';

    if (!await waitStep(700)) return;

    // ========================================================
    // TRANSITION: Chat fades out, macOS Window slides up
    // ========================================================
    chatIntroContainer.classList.add('fade-out');
    if (!await waitStep(100)) return;
    macosWindow.classList.add('slide-up-active');

    // Wait for the window to finish sliding up and settling
    if (!await waitStep(1000)) return;

    // ========================================================
    // PHASE 1: Streaming & Ingesting Agent Telemetry Data
    // ========================================================
    const file1 = { item: document.getElementById('file-item-1'), state: document.getElementById('file-state-1') };
    const file2 = { item: document.getElementById('file-item-2'), state: document.getElementById('file-state-2') };
    const file3 = { item: document.getElementById('file-item-3'), state: document.getElementById('file-state-3') };
    const file4 = { item: document.getElementById('file-item-4'), state: document.getElementById('file-state-4') };

    // Slower, readable pacing (~60ms per step = 6.0 seconds total)
    for (let p = 1; p <= 100; p++) {
      if (!await waitStep(58)) return;
      if (fetchBarFill) fetchBarFill.style.width = p + '%';
      if (fetchPercent) fetchPercent.textContent = p + '%';

      // 1. conversations.json arrives
      if (p === 6) {
        if (fetchStatusText) fetchStatusText.textContent = 'Streaming conversations.json (24,800 user turns)...';
        if (file1.item) file1.item.className = 'arriving-file-item arriving';
        if (file1.state) {
          file1.state.className = 'file-state-pill streaming';
          file1.state.textContent = 'Streaming...';
        }
      }
      if (p === 28) {
        if (file1.item) file1.item.className = 'arriving-file-item done';
        if (file1.state) {
          file1.state.className = 'file-state-pill done';
          file1.state.textContent = 'Ingested ✓';
        }
      }

      // 2. agent_events.json arrives
      if (p === 30) {
        if (fetchStatusText) fetchStatusText.textContent = 'Parsing agent_events.json (12.4k tool calls & latency)...';
        if (file2.item) file2.item.className = 'arriving-file-item arriving';
        if (file2.state) {
          file2.state.className = 'file-state-pill streaming';
          file2.state.textContent = 'Parsing...';
        }
      }
      if (p === 52) {
        if (file2.item) file2.item.className = 'arriving-file-item done';
        if (file2.state) {
          file2.state.className = 'file-state-pill done';
          file2.state.textContent = 'Parsed ✓';
        }
      }

      // 3. user_sessions.csv arrives
      if (p === 54) {
        if (fetchStatusText) fetchStatusText.textContent = 'Normalizing user_sessions.csv (8,940 journeys mapped)...';
        if (file3.item) file3.item.className = 'arriving-file-item arriving';
        if (file3.state) {
          file3.state.className = 'file-state-pill streaming';
          file3.state.textContent = 'Normalizing...';
        }
      }
      if (p === 76) {
        if (file3.item) file3.item.className = 'arriving-file-item done';
        if (file3.state) {
          file3.state.className = 'file-state-pill done';
          file3.state.textContent = 'Normalized ✓';
        }
      }

      // 4. feedback.json arrives
      if (p === 78) {
        if (fetchStatusText) fetchStatusText.textContent = 'Enriching feedback.json (3,210 CSAT & sentiment signals)...';
        if (file4.item) file4.item.className = 'arriving-file-item arriving';
        if (file4.state) {
          file4.state.className = 'file-state-pill streaming';
          file4.state.textContent = 'Enriching...';
        }
      }
      if (p === 98) {
        if (file4.item) file4.item.className = 'arriving-file-item done';
        if (file4.state) {
          file4.state.className = 'file-state-pill done';
          file4.state.textContent = 'Enriched ✓';
        }
      }

      if (p === 100) {
        if (fetchStatusText) fetchStatusText.textContent = 'All agent telemetry ingested & enriched. Synthesizing insights...';
      }
    }

    // Pause so visitors can read the completed stream items
    if (!await waitStep(1200)) return;

    // ========================================================
    // TRANSITION: Screen 1 exits, Screen 2 enters
    // ========================================================
    stageUpload.className = 'stage-screen stage-upload exit-up';
    if (!await waitStep(220)) return;
    stageDashboard.className = 'stage-screen stage-dashboard active';

    if (!await waitStep(500)) return;

    // ========================================================
    // PHASE 2: AI Intelligence Pipeline (6 Steps -> 100%)
    // ========================================================
    const pipelineSteps = [
      { num: 1, activeStatus: 'Ingesting...', doneStatus: 'Complete', targetPct: '16%' },
      { num: 2, activeStatus: 'Validating...', doneStatus: 'Complete', targetPct: '33%' },
      { num: 3, activeStatus: 'Structuring...', doneStatus: 'Complete', targetPct: '50%' },
      { num: 4, activeStatus: 'Enriching...', doneStatus: 'Complete', targetPct: '67%' },
      { num: 5, activeStatus: 'Analyzing...', doneStatus: 'Complete', targetPct: '84%' },
      { num: 6, activeStatus: 'Aggregating...', doneStatus: 'Complete', targetPct: '100%' }
    ];

    for (const step of pipelineSteps) {
      const stepItem = document.getElementById(`pipe-step-${step.num}`);
      const icon = document.getElementById(`pipe-icon-${step.num}`);
      const status = document.getElementById(`pipe-status-${step.num}`);

      // Update Header badge & bar
      if (pipeStepBadge) {
        pipeStepBadge.textContent = `Running · step ${step.num} of 6`;
      }
      if (pipeBarFill) {
        pipeBarFill.style.width = step.targetPct;
      }

      // Activate step
      if (stepItem) stepItem.className = 'pipe-step-item active';
      if (icon) {
        icon.className = 'pipe-status-icon active';
        icon.textContent = '●';
      }
      if (status) {
        status.className = 'pipe-step-status active';
        status.textContent = step.activeStatus;
      }

      // Time for step processing
      if (!await waitStep(850)) return;

      // Complete step
      if (stepItem) stepItem.className = 'pipe-step-item done';
      if (icon) {
        icon.className = 'pipe-status-icon done';
        icon.textContent = '✓';
      }
      if (status) {
        status.className = 'pipe-step-status done';
        status.textContent = step.doneStatus;
      }

      if (!await waitStep(250)) return;
    }

    // Complete pipeline state
    if (pipeStepBadge) {
      pipeStepBadge.className = 'pipe-step-badge complete';
      pipeStepBadge.textContent = 'Complete · 6 of 6 steps';
    }

    if (!await waitStep(400)) return;

    // Reveal the full-length Visualize Data button
    if (pipeActionRow) {
      pipeActionRow.classList.add('visible');
    }

    if (!await waitStep(700)) return;

    // ========================================================
    // PHASE 3: Cursor Animation & Click on "Visualize Data"
    // ========================================================
    if (simMousePointer && btnVisualizeData && macosBody) {
      const bodyRect = macosBody.getBoundingClientRect();
      const btnRect = btnVisualizeData.getBoundingClientRect();

      // Start position of cursor: bottom-right inside the window
      const startX = bodyRect.width - 70;
      const startY = bodyRect.height - 40;

      simMousePointer.style.transition = 'none';
      simMousePointer.style.transform = `translate(${startX}px, ${startY}px)`;
      simMousePointer.style.opacity = '0';

      // Force layout reflow
      simMousePointer.offsetHeight;

      // Animate glide to the center of the button
      const targetX = (btnRect.left - bodyRect.left) + (btnRect.width / 2) - 5;
      const targetY = (btnRect.top - bodyRect.top) + (btnRect.height / 2) - 4;

      simMousePointer.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
      simMousePointer.style.opacity = '1';
      simMousePointer.style.transform = `translate(${targetX}px, ${targetY}px)`;

      // Wait for cursor to reach the button
      if (!await waitStep(900)) return;

      // Trigger hover state
      btnVisualizeData.classList.add('sim-hover');
      if (!await waitStep(280)) return;

      // Mouse click down
      simMousePointer.classList.add('clicking');
      btnVisualizeData.classList.add('sim-clicked');
      if (!await waitStep(220)) return;

      // Mouse click release
      simMousePointer.classList.remove('clicking');
      btnVisualizeData.classList.remove('sim-clicked');

      // Fade out cursor
      simMousePointer.style.transition = 'opacity 0.3s ease';
      simMousePointer.style.opacity = '0';

      if (!await waitStep(300)) return;

      // ========================================================
      // TRANSITION: Screen 2 exits -> Screen 3 (Dashboard) enters!
      // ========================================================
      stageDashboard.className = 'stage-screen stage-dashboard exit-up';
      if (!await waitStep(220)) return;
      stageVisualize.className = 'stage-screen stage-visualize active';
      if (macosTitle) macosTitle.textContent = 'Dashboard — Enterprise AI Intelligence';

      // Animate live count-up for KPI metrics on load
      setTimeout(() => {
        if (isCurrent()) {
          animateCount(document.getElementById('kpi-val-1'), 2.4, 'M', 1, 950, animId);
          animateCount(document.getElementById('kpi-val-2'), 18, '', 0, 750, animId);
          animateCount(document.getElementById('kpi-val-3'), 84.2, '%', 1, 950, animId);
          animateCount(document.getElementById('kpi-val-4'), 1.4, 's', 1, 850, animId);
        }
      }, 100);

      // Re-trigger SVG draw animation on load
      const chartLine = document.getElementById('chart-line-path');
      if (chartLine) {
        chartLine.style.animation = 'none';
        chartLine.offsetHeight;
        chartLine.style.animation = 'drawLine 1.8s ease-out forwards';
      }
    }
  }

  // ========================================================
  // Dashboard User Interactivity Handlers
  // ========================================================
  
  // Time filter pills
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Interaction Trends tabs
  const trendTabs = document.querySelectorAll('.trend-tab');
  const chartLine = document.getElementById('chart-line-path');
  const chartArea = document.querySelector('.chart-area');

  const chartCurves = {
    'interactions': {
      line: 'M0,115 C40,95 80,110 120,70 C160,30 200,55 240,40 C280,20 320,50 360,25 C400,10 430,18 460,12',
      area: 'M0,115 C40,95 80,110 120,70 C160,30 200,55 240,40 C280,20 320,50 360,25 C400,10 430,18 460,12 L460,140 L0,140 Z'
    },
    'active-users': {
      line: 'M0,125 C50,115 90,85 130,80 C170,75 210,42 250,48 C290,52 330,34 370,30 C410,25 435,20 460,15',
      area: 'M0,125 C50,115 90,85 130,80 C170,75 210,42 250,48 C290,52 330,34 370,30 C410,25 435,20 460,15 L460,140 L0,140 Z'
    },
    'session-depth': {
      line: 'M0,95 C50,78 90,90 130,60 C170,30 210,68 250,34 C290,16 330,42 370,20 C410,12 435,24 460,8',
      area: 'M0,95 C50,78 90,90 130,60 C170,30 210,68 250,34 C290,16 330,42 370,20 C410,12 435,24 460,8 L460,140 L0,140 Z'
    }
  };

  trendTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      trendTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const metric = tab.dataset.metric;
      if (chartCurves[metric] && chartLine && chartArea) {
        chartLine.setAttribute('d', chartCurves[metric].line);
        chartArea.setAttribute('d', chartCurves[metric].area);
        chartLine.style.animation = 'none';
        chartLine.offsetHeight;
        chartLine.style.animation = 'drawLine 1.2s ease-out forwards';
      }
    });
  });

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking nav links or action button
    const navLinks = mainNav.querySelectorAll('.nav-link, .btn-navbar-demo');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // "See how it works" smooth center-scroll handler & animation replay
  const btnSeeHow = document.getElementById('btn-see-how-it-works') || document.querySelector('a[href="#how-it-works"]');
  const heroDisplay = document.getElementById('hero-display') || document.getElementById('how-it-works');

  if (btnSeeHow && heroDisplay) {
    btnSeeHow.addEventListener('click', (e) => {
      e.preventDefault();

      const siteHeader = document.getElementById('site-header');
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
      const rect = heroDisplay.getBoundingClientRect();
      const elementHeight = heroDisplay.offsetHeight;
      const visibleViewportHeight = window.innerHeight - headerHeight;

      // Position the animation box in the vertical center of the visible area
      const verticalPadding = (visibleViewportHeight > elementHeight)
        ? (visibleViewportHeight - elementHeight) / 2
        : 16;

      const targetScrollY = window.pageYOffset + rect.top - headerHeight - verticalPadding;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });

      // Replay hero animation
      runAnimationSequence();
    });
  }

  // ========================================================
  // Auto-Switching Interactive Feature Tabs Controller
  // ========================================================
  const autoTabsSections = document.querySelectorAll('.auto-tabs-section');

  const tabTitles = {
    1: 'Executive Intelligence · Today',
    2: 'Root Cause Investigation · Patient Conversion −14%',
    3: 'Executive Decision Brief · Recommendation #284',
    4: 'Decision Execution Tracker · Decision #284'
  };

  const TAB_ROTATION_INTERVAL = 4800;

  autoTabsSections.forEach(section => {
    const autoTabBtns = section.querySelectorAll('.auto-tab-btn');
    const tabPanes = section.querySelectorAll('.tab-pane');
    const macAppTitle = section.querySelector('.mac-app-title');
    const btnPauseTabs = section.querySelector('.btn-pause-animation');
    const iconPause = section.querySelector('.icon-pause');
    const iconPlay = section.querySelector('.icon-play');
    const playbackLabel = section.querySelector('.playback-label');

    let activeTabNum = 1;
    let autoTabTimer = null;
    let hasAutoTabsStarted = false;
    let isTabRotationPaused = false;

    function switchFeatureTab(tabNum) {
      activeTabNum = parseInt(tabNum, 10);

      // Update buttons & reset progress line animations
      autoTabBtns.forEach(btn => {
        const btnTab = parseInt(btn.dataset.tab, 10);
        const isActive = btnTab === activeTabNum;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

        const indicator = btn.querySelector('.tab-progress-indicator');
        if (indicator) {
          indicator.style.animation = 'none';
          if (isActive && hasAutoTabsStarted) {
            // Trigger DOM reflow to restart keyframe animation downwards from 0%
            void indicator.offsetHeight;
            indicator.style.animation = '';
            if (isTabRotationPaused) {
              indicator.style.animationPlayState = 'paused';
            }
          }
        }
      });

      // Update panes in this section
      tabPanes.forEach(pane => {
        const paneTab = parseInt(pane.dataset.pane || (pane.id && pane.id.match(/\d+$/) ? pane.id.match(/\d+$/)[0] : '0'), 10);
        if (paneTab === activeTabNum) {
          if (hasAutoTabsStarted) {
            void pane.offsetWidth; // Force reflow to restart CSS animations cleanly
          }
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Update window titlebar
      if (macAppTitle && tabTitles[activeTabNum]) {
        macAppTitle.textContent = tabTitles[activeTabNum];
      }
    }

    function startAutoTabRotation() {
      stopAutoTabRotation();
      if (isTabRotationPaused || !hasAutoTabsStarted) return;
      autoTabTimer = setInterval(() => {
        const nextTab = activeTabNum >= autoTabBtns.length ? 1 : activeTabNum + 1;
        switchFeatureTab(nextTab);
      }, TAB_ROTATION_INTERVAL);
    }

    function stopAutoTabRotation() {
      if (autoTabTimer) {
        clearInterval(autoTabTimer);
        autoTabTimer = null;
      }
    }

    function toggleTabPlayback(shouldPause) {
      isTabRotationPaused = typeof shouldPause === 'boolean' ? shouldPause : !isTabRotationPaused;
      
      if (isTabRotationPaused) {
        stopAutoTabRotation();
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'inline-flex';
        if (playbackLabel) playbackLabel.textContent = 'Resume animation';
        if (btnPauseTabs) {
          btnPauseTabs.setAttribute('aria-label', 'Resume animation');
          btnPauseTabs.setAttribute('title', 'Resume auto-rotation');
          btnPauseTabs.classList.add('is-paused');
        }
        const activeIndicator = section.querySelector('.auto-tab-btn.active .tab-progress-indicator');
        if (activeIndicator) {
          activeIndicator.style.animationPlayState = 'paused';
        }
      } else {
        if (iconPause) iconPause.style.display = 'inline-flex';
        if (iconPlay) iconPlay.style.display = 'none';
        if (playbackLabel) playbackLabel.textContent = 'Pause animation';
        if (btnPauseTabs) {
          btnPauseTabs.setAttribute('aria-label', 'Pause animation');
          btnPauseTabs.setAttribute('title', 'Pause auto-rotation');
          btnPauseTabs.classList.remove('is-paused');
        }
        const activeIndicator = section.querySelector('.auto-tab-btn.active .tab-progress-indicator');
        if (activeIndicator) {
          activeIndicator.style.animationPlayState = 'running';
        }
        startAutoTabRotation();
      }
    }

    if (btnPauseTabs) {
      btnPauseTabs.addEventListener('click', () => {
        toggleTabPlayback();
      });
    }

    // Click listeners for manual tab selection
    autoTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!hasAutoTabsStarted) {
          hasAutoTabsStarted = true;
        }
        const tabNum = btn.dataset.tab;
        switchFeatureTab(tabNum);
        if (!isTabRotationPaused) {
          startAutoTabRotation(); // Reset timer after manual click
        }
      });
    });

    // Start tabs on scroll observer
    function startTabsOnScroll() {
      if (hasAutoTabsStarted) return;
      hasAutoTabsStarted = true;
      switchFeatureTab(1);
      startAutoTabRotation();
    }

    const tabsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoTabsStarted) {
          startTabsOnScroll();
          observer.unobserve(section);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    tabsObserver.observe(section);

    // Initial static pane setup without starting animations
    if (autoTabBtns.length > 0) {
      switchFeatureTab(1);
    }
  });

  // ========================================================
  // Section 4: 3-Card Showcase One-Time Animation Controller
  // ========================================================
  const orbitRotator = document.getElementById('orbit-rotator');
  const showcaseSection = document.getElementById('showcase');
  let hasShowcaseAnimated = false;

  function triggerShowcaseAnimations() {
    if (!showcaseSection || hasShowcaseAnimated) return;
    hasShowcaseAnimated = true;
    showcaseSection.classList.add('showcase-animated');
    if (orbitRotator) {
      orbitRotator.classList.remove('is-rotating');
      void orbitRotator.offsetWidth; // Force DOM reflow to restart rotation cleanly
      orbitRotator.classList.add('is-rotating');
    }
  }

  if (showcaseSection) {
    const showcaseObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasShowcaseAnimated) {
          triggerShowcaseAnimations();
          observer.unobserve(showcaseSection);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    showcaseObserver.observe(showcaseSection);
  }

  // Auto-start hero animation sequence on load
  setTimeout(() => {
    runAnimationSequence();
  }, 400);
});


