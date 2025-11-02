import { ExerciseDetails } from '../types';

export const EXERCISE_DATABASE: ExerciseDetails[] = [
  // WARM-UP
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A simple dynamic stretch to warm up the shoulder joints and surrounding muscles.',
    instructions: [
      'Stand with your feet shoulder-width apart, arms extended to your sides at shoulder height.',
      'Slowly rotate your arms forward in small circles, gradually increasing the size.',
      'After about 15 seconds, reverse the direction and make backward circles.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/1hp3-mFN2eA',
    keywords: ['shoulder circles']
  },
  {
    id: 'leg-swings-front-back',
    name: 'Leg Swings (Front to Back)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch to open up the hips and warm up the hamstrings and hip flexors.',
    instructions: [
      'Hold onto a wall or sturdy object for balance.',
      'Swing one leg forward and backward in a controlled, fluid motion like a pendulum.',
      'Focus on the range of motion, not height.',
      'Repeat for 10-15 swings, then switch legs.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/daH-F3I2z18'
  },
  {
    id: 'leg-swings-side-to-side',
    name: 'Leg Swings (Side to Side)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'Warms up the hip joint and stretches the inner and outer thigh muscles.',
    instructions: [
      'Hold onto a wall for balance, facing it.',
      'Swing one leg side-to-side in front of your body.',
      'Keep your core engaged and upper body stable.',
      'Repeat for 10-15 swings, then switch legs.'
    ],
    muscleGroups: ['Abductors', 'Adductors'],
    videoUrl: 'https://www.youtube.com/embed/daH-F3I2z18'
  },
  {
    id: 'jumping-jacks-warmup',
    name: 'Jumping Jacks (Warm-up)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A classic full-body movement to increase heart rate and warm up major muscle groups.',
    instructions: [
      'Start standing with your feet together and arms at your sides.',
      'Simultaneously jump your feet out to the sides while raising your arms overhead.',
      'Immediately jump back to the starting position.',
      'Perform at a light, controlled pace.'
    ],
    muscleGroups: ['Full Body'],
    videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA'
  },
  {
    id: 'torso-twists',
    name: 'Torso Twists',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch that warms up the core and improves rotational mobility in the spine.',
    instructions: [
      'Stand with feet shoulder-width apart and knees slightly bent.',
      'Rotate your torso from side to side in a controlled manner, allowing your arms to swing freely.',
      'Allow your hips and feet to pivot naturally with the movement.'
    ],
    muscleGroups: ['Abdominals', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/s_eB6K3aM9E',
    keywords: ['standing twists']
  },
  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A simple exercise to release tension and increase mobility in the shoulders and upper back.',
    instructions: [
      'Stand or sit tall.',
      'Slowly lift your shoulders up towards your ears, then roll them backward and down.',
      'Create a large, smooth circle.',
      'After several repetitions, reverse the direction and roll your shoulders forward.'
    ],
    muscleGroups: ['Shoulders', 'Traps'],
    videoUrl: 'https://www.youtube.com/embed/y8J_SADm_9w'
  },
  {
    id: 'arm-swings-across-chest',
    name: 'Arm Swings (Across Chest)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch for the chest, back, and shoulders, promoting blood flow to the upper body.',
    instructions: [
      'Stand with your feet shoulder-width apart.',
      'Extend your arms out to your sides.',
      'Swing your arms across your chest, alternating which arm is on top each time.',
      'Perform the movement in a controlled but fluid manner.'
    ],
    muscleGroups: ['Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/f0eT32qA1aA'
  },
  {
    id: 'scapular-wall-slides',
    name: 'Scapular Wall Slides',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'An excellent exercise for improving shoulder mobility, posture, and activating the muscles of the upper back.',
    instructions: [
      'Stand with your back against a wall, feet slightly away from it.',
      'Press your lower back, upper back, and head against the wall.',
      'Raise your arms to the sides with elbows bent at 90 degrees (like a goalpost), pressing your forearms and wrists against the wall.',
      'Slowly slide your arms up the wall, then back down, maintaining contact.'
    ],
    muscleGroups: ['Upper Back', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/p_AtE7a_k-w'
  },
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Stretch (Dynamic)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A gentle dynamic movement that warms up the spine and stretches the back and abdominal muscles.',
    instructions: [
      'Start on your hands and knees in a tabletop position.',
      'Inhale as you drop your belly towards the floor and look up (Cow Pose).',
      'Exhale as you round your spine towards the ceiling and tuck your chin to your chest (Cat Pose).',
      'Flow smoothly between the two poses.'
    ],
    muscleGroups: ['Lower Back', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/kqnua4rHVVA'
  },
  {
    id: 'dynamic-thread-the-needle',
    name: 'Arm Reach-Through (Dynamic Thread the Needle)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'Improves thoracic (upper/mid-back) spinal rotation and opens up the shoulders.',
    instructions: [
      'Start on all fours.',
      'Inhale and reach one arm up towards the ceiling.',
      'Exhale and "thread" that arm through the space under your supporting arm, reaching as far as you can.',
      'Inhale to reach back up. Repeat for several reps before switching sides.'
    ],
    muscleGroups: ['Upper Back', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/o05C4c653es'
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A simple mobility drill to warm up and lubricate the hip joints.',
    instructions: [
      'Stand with your feet together, holding onto something for balance if needed.',
      'Lift one knee to a 90-degree angle.',
      'Slowly rotate your knee outwards, making a large circle with your hip.',
      'Perform several circles in one direction, then reverse.',
      'Switch legs.'
    ],
    muscleGroups: ['Glutes', 'Hips'],
    videoUrl: 'https://www.youtube.com/embed/EjrrA3zL-0w'
  },
  {
    id: 'walking-lunges-with-twist',
    name: 'Walking Lunges with Twist',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic warm-up that combines a lunge with a torso twist to activate the legs, glutes, and core.',
    instructions: [
      'Step forward into a lunge with your right foot.',
      'As you lower into the lunge, twist your torso to the right.',
      'Return to center, then push off your back foot to step into a lunge with your left foot, twisting to the left.',
      'Continue alternating.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/p_pS4aA2L-c'
  },
  {
    id: 'knee-hugs-to-lunge',
    name: 'Knee Hugs to Lunge',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch that opens up the hips and activates the glutes.',
    instructions: [
      'Stand tall. Pull one knee into your chest for a brief hug.',
      'Release the hug and step that same leg forward directly into a lunge.',
      'Push off the front foot to return to standing.',
      'Alternate legs with each repetition.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/F4D8v_A3O5E'
  },
  {
    id: 'toy-soldiers',
    name: 'Toy Soldiers (Straight Leg Kicks)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch that warms up the hamstrings and improves coordination.',
    instructions: [
      'Stand tall and walk forward.',
      'With each step, kick one leg straight out in front of you.',
      'Reach with the opposite hand towards your kicking foot.',
      'Keep your back straight and avoid bending at the waist.'
    ],
    muscleGroups: ['Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/KUE7-Fc6z-Y'
  },
  {
    id: 'lateral-lunges',
    name: 'Lateral Lunges (Side-to-Side)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic stretch that warms up the inner thighs (adductors) and improves hip mobility.',
    instructions: [
      'Stand with your feet wide apart.',
      'Shift your weight to one side, bending that knee and keeping the other leg straight.',
      'Sit your hips back as you lunge.',
      'Push off to return to the center, then lunge to the other side.'
    ],
    muscleGroups: ['Adductors', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/q_S4uOKlS-0'
  },
  {
    id: 'high-knees-warmup',
    name: 'High Knees (Warm-up)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic exercise to raise your heart rate and activate your hip flexors and leg muscles.',
    instructions: [
      'Stand in place or jog lightly.',
      'Drive one knee up towards your chest, then quickly switch to the other leg.',
      'Maintain an upright posture and use your arms to help with momentum.',
      'Perform at a moderate pace for a warm-up.'
    ],
    muscleGroups: ['Quadriceps', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/D0b016-17vU'
  },
  {
    id: 'butt-kicks-warmup',
    name: 'Butt Kicks (Warm-up)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A dynamic warm-up exercise that actively stretches the quadriceps and warms up the hamstrings.',
    instructions: [
      'Stand in place or jog lightly.',
      'Alternate kicking your heels up towards your glutes.',
      'Keep your upper body upright and knees pointed towards the ground.',
      'Maintain a quick, steady rhythm.'
    ],
    muscleGroups: ['Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/g-i_m8Lg-e4'
  },
  {
    id: 'inchworm-to-plank',
    name: 'Inchworm to Plank',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A full-body dynamic stretch that lengthens the hamstrings and activates the core and shoulders.',
    instructions: [
      'Stand tall, then hinge at your hips to place your hands on the floor.',
      'Walk your hands forward into a high plank position.',
      'Hold the plank for a moment, then walk your feet towards your hands.',
      'Slowly roll up to a standing position and repeat.'
    ],
    muscleGroups: ['Hamstrings', 'Shoulders', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/b2-_b-Yk_sA'
  },
  {
    id: 'worlds-greatest-stretch',
    name: 'World’s Greatest Stretch (Dynamic)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A complex, multi-part stretch that targets hip flexors, hamstrings, and thoracic spine mobility all in one.',
    instructions: [
      'Step forward into a deep lunge with your right foot.',
      'Place your left hand on the floor and your right elbow inside your right foot.',
      'Rotate your torso and reach your right arm up to the ceiling.',
      'Return your hand to the floor, step back to plank, and repeat on the other side.'
    ],
    muscleGroups: ['Hip Flexors', 'Hamstrings', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/K0t-a23yO2s'
  },
  {
    id: 'ankle-bounces',
    name: 'Ankle Bounces / Calf Mobilizations',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A light plyometric drill to warm up the calves and Achilles tendons, preparing them for jumping.',
    instructions: [
      'Stand with feet hip-width apart, knees slightly bent.',
      'Perform small, quick bounces on the balls of your feet.',
      'Keep your heels off the ground.',
      'The movement should be light and springy, primarily using your ankles.'
    ],
    muscleGroups: ['Calves', 'Ankles'],
    videoUrl: 'https://www.youtube.com/embed/g8_j1gH4l_M'
  },

  // JUMP ROPE
  {
    id: 'basic-bounce',
    name: 'Basic Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'The fundamental jump rope movement, perfect for warming up and building a foundation.',
    instructions: [
      'Hold the handles with a relaxed grip, elbows close to your body.',
      'Swing the rope over your head using your wrists, not your shoulders.',
      'Jump just high enough to clear the rope, about 1-2 inches off the ground.',
      'Land softly on the balls of your feet.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Glutes', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/g8_j1gH4l_M',
    keywords: ['basic jump', 'regular bounce', 'two-foot bounce']
  },
  {
    id: 'alternate-foot-step-jump',
    name: 'Alternate Foot Step Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A foundational jump rope skill that mimics running in place, excellent for improving coordination and endurance.',
    instructions: [
      'Start with a basic bounce rhythm.',
      'As the rope comes around, jump over it with one foot, then immediately jump over it with the other foot on the next rotation.',
      'It should feel like a light jog or run in place.',
      'Stay on the balls of your feet and keep your knees slightly bent.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/LPz_pDmj9k8',
    keywords: ['running in place', 'alternate foot']
  },
   {
    id: 'side-to-side-jump',
    name: 'Side-to-Side Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A simple variation that involves hopping side-to-side, improving lateral quickness and engaging different parts of the lower leg muscles.',
    instructions: [
      'Start with a basic two-foot bounce.',
      'On each jump, hop a few inches to one side.',
      'On the next jump, hop back to the center or to the opposite side.',
      'Keep your feet together and maintain a steady rhythm.'
    ],
    muscleGroups: ['Calves', 'Abductors', 'Adductors'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['side hops']
  },
  {
    id: 'forward-backward-jump',
    name: 'Forward-Backward Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'This variation involves hopping forward and backward, challenging your balance and coordination.',
    instructions: [
      'Begin with a basic two-foot bounce in a neutral position.',
      'On one jump, hop a few inches forward.',
      'On the next jump, hop back to your starting position or slightly behind it.',
      'Keep your feet together and focus on small, controlled hops.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/p3uS33tqNoc',
    keywords: ['front-to-back hops']
  },
  {
    id: 'boxer-step',
    name: 'Boxer Step (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A low-impact alternative to the basic bounce, great for longer sessions and improving footwork.',
    instructions: [
      'Start with a basic bounce rhythm.',
      'Shift your weight from one foot to the other with each jump, tapping the non-jumping foot lightly.',
      'Keep your knees slightly bent and stay on the balls of your feet.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Abdominals', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/M8A-sxkC8-k',
    keywords: ['boxer shuffle']
  },
  {
    id: 'heel-toe-step-jump',
    name: 'Heel-Toe Step Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A coordination-building step where you alternate tapping your heel and toe in front of you.',
    instructions: [
      'Begin with a boxer step to get the rhythm.',
      'As you jump on your supporting foot, tap the heel of your other foot on the ground in front of you.',
      'On the next jump, tap the toe of the same foot on the ground.',
      'Continue alternating heel and toe taps for a set duration, then switch feet.'
    ],
    muscleGroups: ['Calves', 'Anterior Tibialis'],
    videoUrl: 'https://www.youtube.com/embed/5UfB70WflwQ',
    keywords: ['heel taps']
  },
  {
    id: 'single-leg-jump-right',
    name: 'Single Leg Jump Right (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Jumping on a single leg increases the intensity and challenges your balance, stability, and calf strength on the supporting leg.',
    instructions: [
      'Lift your left foot off the ground.',
      'Perform basic jumps using only your right leg.',
      'Focus on small, controlled hops and maintaining your balance.',
      'Keep your core engaged to prevent wobbling.'
    ],
    muscleGroups: ['Calves', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/VciaF2a_eL8',
    keywords: ['one-leg jump', 'single foot jump']
  },
  {
    id: 'single-leg-jump-left',
    name: 'Single Leg Jump Left (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Jumping on a single leg increases the intensity and challenges your balance, stability, and calf strength on the supporting leg.',
    instructions: [
      'Lift your right foot off the ground.',
      'Perform basic jumps using only your left leg.',
      'Focus on small, controlled hops and maintaining your balance.',
      'Keep your core engaged to prevent wobbling.'
    ],
    muscleGroups: ['Calves', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/VciaF2a_eL8',
    keywords: ['one-leg jump', 'single foot jump']
  },
  {
    id: 'skier-jump',
    name: 'Skier Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'This move involves jumping side to side with feet together, engaging the obliques and improving lateral quickness.',
    instructions: [
      'Start with a basic bounce, keeping your feet together.',
      'On each jump, hop a few inches to one side.',
      'On the next jump, hop to the opposite side.',
      'Keep your feet and knees together as you move side to side, like a slalom skier.'
    ],
    muscleGroups: ['Calves', 'Abdominals', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['ski jumps', 'slalom jumps', 'twist jumps']
  },
  {
    id: 'bell-jump',
    name: 'Bell Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A dynamic jump that involves moving forward and backward in a bell-like motion, improving coordination and engaging the core.',
    instructions: [
      'Start with a basic two-foot bounce.',
      'Jump forward a few inches, then immediately jump backward to the starting point.',
      'Keep your feet together throughout the movement.',
      'The motion should be forward and back, resembling a ringing bell.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/p3uS33tqNoc',
    keywords: ['front-and-back jump']
  },
  {
    id: 'high-knees-jump',
    name: 'High Knees Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Increases cardiovascular intensity and engages the core and quads more than a basic jump.',
    instructions: [
      'While jumping, alternate lifting each knee up towards your chest.',
      'Aim to bring your thigh parallel to the ground.',
      'Maintain a steady rhythm and keep your core tight.'
    ],
    muscleGroups: ['Quadriceps', 'Abdominals', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/jK51k2v7vjY'
  },
  {
    id: 'rope-jacks',
    name: 'Rope Jacks (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Combines the classic jumping jack motion with jumping rope, enhancing coordination and working different leg muscles.',
    instructions: [
      'Start with a basic bounce with feet together.',
      'On the next jump, land with your feet wide apart (straddle position).',
      'On the following jump, bring your feet back together.',
      'Continue alternating between feet together and feet apart with each rope turn.'
    ],
    muscleGroups: ['Quadriceps', 'Adductors', 'Abductors', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/5Y_15oHiGxc',
    keywords: ['jumping jack jump', 'side straddle']
  },
  {
    id: 'scissor-jump',
    name: 'Scissor Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A jump rope variation that involves alternating your feet forward and backward, similar to a scissor motion.',
    instructions: [
      'Begin with a basic bounce.',
      'On the next jump, land with one foot forward and one foot back.',
      'On the following jump, switch the position of your feet.',
      'Keep your upper body stable and core engaged.'
    ],
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/p3uS33tqNoc',
    keywords: ['scissors', 'scissor jumps', 'forward straddle']
  },
  {
    id: 'jump-rope-burpee',
    name: 'Jump Rope Burpee (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A high-intensity, full-body exercise that combines a jump rope basic jump with a traditional burpee for a major cardio and strength challenge.',
    instructions: [
      'Perform one basic jump.',
      'After the jump, immediately drop your handles and lower into a squat with your hands on the floor.',
      'Kick your feet back to a plank position.',
      'Return your feet to the squat position, stand up, pick up your handles, and perform another jump.',
      'For an added challenge, add a push-up while in the plank position.'
    ],
    muscleGroups: ['Quadriceps', 'Chest', 'Abdominals', 'Glutes', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['burpee jump']
  },
  {
    id: 'lateral-step-jump',
    name: 'Lateral Step Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A variation of the boxer step that involves stepping side-to-side, improving lateral movement and coordination.',
    instructions: [
      'Start with a boxer step rhythm.',
      'Instead of stepping in place, step a few inches to the right as you jump on your right foot.',
      'Then, step to the left as you jump on your left foot.',
      'Continue this side-to-side stepping motion.'
    ],
    muscleGroups: ['Quadriceps', 'Calves', 'Abductors', 'Adductors'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['side step']
  },
  {
    id: 'double-unders',
    name: 'Double Unders (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'An explosive movement where the rope passes under your feet twice for every single jump.',
    instructions: [
      'Jump higher than you would for a basic bounce.',
      'Use a powerful flick of the wrists to increase rope speed.',
      'Keep your core tight and body in a straight line.',
      'Tuck your knees slightly to give the rope more room to pass.'
    ],
    muscleGroups: ['Hamstrings', 'Calves', 'Abdominals', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/82j00w4kv5Y',
    keywords: ['dubs']
  },
   {
    id: 'triple-unders',
    name: 'Triple Unders (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'An expert-level skill where the rope passes under your feet three times in a single jump, requiring extreme speed and coordination.',
    instructions: [
      'Master the double under first.',
      'Jump even higher than a double under, bringing your knees up slightly.',
      'Use an extremely fast and powerful wrist flick to rotate the rope three times.',
      'Focus on maintaining a tight body position and landing softly.'
    ],
    muscleGroups: ['Hamstrings', 'Calves', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/hB5P-6TbfI4',
    keywords: ['trips']
  },
  {
    id: 'weighted-handle-jumps',
    name: 'Weighted Handle Jumps (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Using a rope with weighted handles increases the challenge on the upper body, building shoulder and forearm strength.',
    instructions: [
      'Use a speed rope with weighted handles.',
      'Perform any basic jump variation (e.g., Basic Jump, Boxer Step).',
      'Focus on maintaining proper form and wrist rotation, as the added weight will cause more fatigue.',
      'Keep your shoulders relaxed and elbows in.'
    ],
    muscleGroups: ['Shoulders', 'Hamstrings', 'Forearms', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['heavy handles']
  },
  {
    id: 'heavy-rope-jumps',
    name: 'Heavy Rope Jumps (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'weighted-rope',
    workoutType: 'Cardio/HIIT',
    description: 'Performing jumps with a weighted rope significantly increases resistance, building full-body power and strength.',
    instructions: [
      'Use a weighted rope (0.5 lb or heavier).',
      'Focus on using your wrists to turn the heavier rope, but expect more arm and shoulder engagement.',
      'Maintain the same form as a regular basic bounce but at a slower pace.',
      'Keep your core engaged to stabilize your body against the rope\'s force.'
    ],
    muscleGroups: ['Hamstrings', 'Shoulders', 'Forearms', 'Abdominals', 'Calves', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/CXm_eC42lVg',
    keywords: ['heavy rope', 'weighted rope']
  },
  {
    id: 'side-shuffle-jump',
    name: 'Side Shuffle Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A dynamic footwork drill that involves shuffling laterally while jumping, enhancing agility and targeting the glutes and abductors.',
    instructions: [
      'Start with a boxer step.',
      'Perform two to three boxer steps while shuffling to your right.',
      'Then, perform two to three boxer steps while shuffling back to your left.',
      'Stay low and quick on your feet, keeping the rope turning consistently.'
    ],
    muscleGroups: ['Glutes', 'Abductors', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['shuffle jump']
  },
  {
    id: 'crossover-step',
    name: 'Crossover Step (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A footwork-focused move where you cross one foot in front of the other, challenging balance and engaging the glutes.',
    instructions: [
      'Start with a basic bounce or alternate foot step.',
      'On one jump, cross your right foot over your left and land.',
      'On the next jump, uncross your feet.',
      'On the following jump, cross your left foot over your right and land. Continue alternating.'
    ],
    muscleGroups: ['Glutes', 'Adductors', 'Abductors', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/L8fvypoZc7c',
    keywords: ['cross step']
  },
  {
    id: 'twist-jump',
    name: 'Twist Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Engages the core and glutes by twisting the hips from side to side with each jump.',
    instructions: [
      'Begin with a basic two-foot bounce with feet together.',
      'On each jump, twist your hips and lower body to one side while keeping your upper body facing forward.',
      'On the next jump, twist to the opposite side.',
      'Focus on a sharp, controlled rotation from the core.'
    ],
    muscleGroups: ['Glutes', 'Abdominals', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['hip twists']
  },
  {
    id: 'criss-cross',
    name: 'Criss-Cross (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A classic freestyle trick that improves coordination and timing by crossing the arms.',
    instructions: [
      'Perform a basic bounce to get your rhythm.',
      'On one jump, cross your arms in front of your body.',
      'Jump through the loop created by the crossed rope.',
      'Immediately uncross your arms on the next jump.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['crossover', 'cross-over']
  },
  {
    id: 'double-side-swing',
    name: 'Double Side Swing (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A variation of the side swing where the rope is swung twice on one side before transitioning, enhancing rhythm and core engagement.',
    instructions: [
      'Swing the rope to one side of your body for two full rotations.',
      'Perform two small "ghost" jumps (without the rope going under) to keep time.',
      'After the second swing, open your arms and jump through the rope.',
      'You can then perform a basic jump or transition to a double side swing on the other side.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/fW098G2b_ps',
    keywords: ['double side whip']
  },
  {
    id: 'side-swing',
    name: 'Side Swing (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A freestyle move where the rope is swung to the side of the body, great for transitions and active recovery.',
    instructions: [
      'Start with a basic bounce.',
      'Bring both hands together on one side of your body (e.g., your right hip).',
      'Swing the rope in a loop on that side, tapping it on the ground.',
      'You can perform a small "ghost" jump to keep rhythm.',
      'Swing the rope back overhead to return to basic jumps or swing to the other side.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/fW098G2b_ps',
    keywords: ['side-whip']
  },
  {
    id: '360-spin-jump',
    name: '360 Spin Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'An advanced trick that involves performing a full 360-degree body turn while jumping over the rope.',
    instructions: [
      'Establish a steady basic jump rhythm.',
      'Perform a slightly higher jump than usual.',
      'As you jump, initiate a spin with your head and shoulders.',
      'Keep the rope turning at a consistent speed and complete the full rotation to land facing forward.',
    ],
    muscleGroups: ['Abdominals', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['full turn']
  },
  {
    id: 'backward-jump',
    name: 'Backward Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'Jumping with the rope spinning backward challenges coordination and works the muscles in a new way.',
    instructions: [
      'Hold the rope in front of you.',
      'Swing the rope backward over your head and jump as it passes under your feet from front to back.',
      'This requires different timing and wrist motion than forward jumping.',
      'Start slowly to find the rhythm.'
    ],
    muscleGroups: ['Abdominals', 'Calves', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['reverse jump']
  },
  {
    id: 'criss-cross-double-under',
    name: 'Criss-Cross Double Under (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'An expert-level skill combining the arm crossover of a Criss-Cross with the speed of a Double Under.',
    instructions: [
      'You must be proficient at both Double Unders and Criss-Cross separately.',
      'Initiate a high jump like a normal Double Under.',
      'As you jump, quickly cross your arms and flick your wrists with enough speed for the rope to pass under twice.',
      'Uncross your arms immediately upon landing.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/L8fvypoZc7c',
    keywords: ['crossover dubs']
  },
  {
    id: 'high-jump-singles',
    name: 'High Jump Singles (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A power-building drill where you perform single jumps with maximum height, focusing on explosive power rather than speed.',
    instructions: [
      'Turn the rope at a slow, deliberate pace.',
      'For each rotation, jump as high as you possibly can, tucking your knees toward your chest.',
      'Focus on exploding off the ground with maximum force.',
      'This is a power drill, not a speed drill.'
    ],
    muscleGroups: ['Shoulders', 'Calves', 'Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['power jumps']
  },
  {
    id: 'butt-kicks-jr',
    name: 'Butt Kicks (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    workoutType: 'Cardio/HIIT',
    description: 'A dynamic jump rope variation that increases intensity and targets the hamstrings.',
    instructions: [
      'While jumping, alternate kicking your heels back towards your glutes.',
      'Keep your knees pointed towards the ground.',
      'Maintain a quick and consistent rhythm with the rope.'
    ],
    muscleGroups: ['Hamstrings', 'Quadriceps', 'Glutes', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/dGIOv_mS-A8'
  },

  // CARDIO
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'Cardio',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Cardio/HIIT',
    description: 'A classic full-body cardio exercise that elevates the heart rate and is great for warming up.',
    instructions: [
      'Start standing with your feet together and arms at your sides.',
      'Simultaneously jump your feet out to the sides while raising your arms overhead.',
      'Immediately jump back to the starting position.',
      'Repeat in a continuous rhythm.'
    ],
    muscleGroups: ['Calves', 'Shoulders', 'Adductors', 'Abductors'],
    videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA',
    keywords: ['star jumps']
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Cardio/HIIT',
    description: 'A full-body, high-intensity exercise that builds strength and cardiovascular endurance.',
    instructions: [
      'Start standing, then drop into a squat position with your hands on the floor.',
      'Kick your feet back into a plank position.',
      'Immediately return your feet to the squat position.',
      'Jump up explosively from the squat position.'
    ],
    muscleGroups: ['Quadriceps', 'Chest', 'Abdominals', 'Glutes', 'Hamstrings', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
    keywords: ['squat thrust']
  },
  
  // UPPER BODY
  {
    id: 'incline-push-up',
    name: 'Incline Push-Up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A push-up variation performed with hands elevated on a surface like a bench or wall, reducing the weight load and making it easier.',
    instructions: [
      'Place your hands on an elevated surface (bench, box, or wall), slightly wider than your shoulders.',
      'Extend your legs back so your body forms a straight line.',
      'Lower your chest to the surface, keeping your core tight.',
      'Push back up to the starting position.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/3WjGrd_s_4w'
  },
  {
    id: 'decline-push-up',
    name: 'Decline Push-Up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'An advanced push-up variation where the feet are elevated, placing more emphasis on the upper chest and shoulders.',
    instructions: [
      'Place your feet on a bench or elevated surface.', 
      'Position your hands on the floor slightly wider than your shoulders.', 
      'Lower your body until your chest nearly touches the floor.', 
      'Push back up to the starting position, maintaining a straight body line.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/SKPab2YC8BE'
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A challenging push-up variation that places a strong emphasis on the triceps by positioning the hands close together.',
    instructions: [
      'Get into a push-up position.', 
      'Place your hands close together on the floor, forming a diamond shape with your thumbs and index fingers.', 
      'Lower your chest towards your hands, keeping your elbows tucked in.', 
      'Push back up to the starting position.'
    ],
    muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/J0DnG1_S_jg'
  },
  {
    id: 'plyometric-push-up',
    name: 'Plyometric Push-Up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'An explosive push-up variation that builds power in the chest and triceps. The most common version is the clap push-up.',
    instructions: [
      'Start in a standard push-up position.', 
      'Lower your chest to the floor.', 
      'Explosively push up with enough force for your hands to leave the ground.', 
      'While airborne, quickly clap your hands together before landing softly back in the starting position.', 
      'Immediately go into the next repetition.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/Z_S_g_b06I0',
    keywords: ['clap push-up']
  },
  {
    id: 'superman-hold',
    name: 'Superman Hold',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'An excellent exercise for strengthening the entire posterior chain, including the lower back, glutes, and hamstrings.',
    instructions: [
      'Lie face down on the floor with your arms and legs extended.', 
      'Simultaneously lift your arms, chest, and legs off the floor.', 
      'Keep your neck in a neutral position by looking at the floor.', 
      'Hold the contraction for the desired time.'
    ],
    muscleGroups: ['Lower Back', 'Glutes', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/z6PJMT2y8GQ'
  },
  {
    id: 'reverse-snow-angels',
    name: 'Reverse Snow Angels',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'A great exercise for improving posture and strengthening the muscles of the upper back and rear shoulders.',
    instructions: [
      'Lie face down on the floor with your arms extended by your sides, palms down.', 
      'Lift your chest and arms slightly off the floor.', 
      'Keeping your arms straight, slowly sweep them in a wide arc until they are overhead.', 
      'Slowly reverse the motion back to the starting position.'
    ],
    muscleGroups: ['Upper Back', 'Shoulders', 'Traps'],
    videoUrl: 'https://www.youtube.com/embed/a79_hVe-7G8'
  },
  {
    id: 'inverted-rows',
    name: 'Inverted Rows',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A fantastic bodyweight exercise for building back and bicep strength. Can be done using a sturdy table, a bar, or TRX.',
    instructions: [
      'Position yourself under a sturdy table or a low bar.', 
      'Grip the edge of the table or bar with an overhand grip, slightly wider than your shoulders.', 
      'Extend your legs, keeping your body in a straight line.', 
      'Pull your chest up to the table or bar, squeezing your shoulder blades together.', 
      'Lower yourself back down with control.'
    ],
    muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/r_J-EEy1j3g',
    keywords: ['bodyweight row', 'table row']
  },
  {
    id: 'doorway-rows',
    name: 'Doorway Rows',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A convenient back exercise that uses a doorway to mimic a rowing motion, strengthening the back and biceps.',
    instructions: [
      'Stand in a doorway and grip both sides of the frame at chest height.', 
      'Lean back until your arms are fully extended.', 
      'Keeping your body straight, pull yourself forward until your chest reaches the doorway.', 
      'Squeeze your back muscles at the peak of the movement.', 
      'Slowly extend your arms to return to the start.'
    ],
    muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/UKp5-o_gI0E'
  },
  {
    id: 'towel-rows',
    name: 'Towel Rows',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'An isometric and dynamic back exercise that creates tension using a towel, requiring significant muscle activation.',
    instructions: [
      'Sit on the floor with your legs extended. Loop a towel around the soles of your feet.', 
      'Grip the ends of the towel with both hands.', 
      'Lean back slightly with a straight back and pull the towel towards your torso as if rowing.', 
      'Actively pull the towel apart with your hands to increase tension.', 
      'Squeeze your shoulder blades together.'
    ],
    muscleGroups: ['Upper Back', 'Lats', 'Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/KYp0w_P1xag'
  },
  {
    id: 'archer-rows',
    name: 'Archer Rows',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A unilateral variation of the inverted row that increases the load on one arm, building single-arm pulling strength.',
    instructions: [
      'Set up for an inverted row under a bar or table.', 
      'As you pull your chest up, focus on pulling primarily with one arm.', 
      'The other arm straightens out to the side for support, similar to an archer.', 
      'Lower with control and repeat on the other side.'
    ],
    muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/pTrhiAY2sTM'
  },
  {
    id: 'shoulder-taps',
    name: 'Shoulder Taps',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'A core stability exercise performed in a plank position that also strengthens the shoulders and improves balance.',
    instructions: [
      'Start in a high plank position with hands under your shoulders and feet wide for stability.', 
      'Without rocking your hips, lift one hand and tap the opposite shoulder.', 
      'Return your hand to the floor and repeat on the other side.', 
      'Keep your core braced throughout the movement.'
    ],
    muscleGroups: ['Shoulders', 'Abdominals', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/gWHQp-G2a2E'
  },
  {
    id: 'handstand-hold',
    name: 'Handstand Hold',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'Builds significant shoulder strength, stability, and balance. Can be done freestanding or against a wall for support.',
    instructions: [
      'Place your hands on the floor about shoulder-width apart, close to a wall.', 
      'Kick your feet up against the wall to get into a handstand position.', 
      'Brace your core, squeeze your glutes, and push through your shoulders.', 
      'Hold the position for as long as you can maintain good form.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Back', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/o0120B-6L94'
  },
  {
    id: 'wall-walks',
    name: 'Wall Walks',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A dynamic exercise that builds the strength and confidence needed for handstands and handstand push-ups.',
    instructions: [
      'Start in a push-up position with your feet against a wall.', 
      'Begin to walk your feet up the wall while simultaneously walking your hands closer to the wall.', 
      'Walk as high as you comfortably can, aiming for a vertical handstand position.', 
      'Slowly walk your hands and feet back down to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/C2t4l_--I04'
  },
  {
    id: 'handstand-push-ups',
    name: 'Handstand Push-Ups',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'The ultimate bodyweight shoulder press, developing incredible strength and stability in the shoulders and triceps.',
    instructions: [
      'Get into a handstand position against a wall.', 
      'Slowly lower your head towards the floor by bending your elbows.', 
      'Go as low as you can with control, ideally touching your head to a mat.', 
      'Press firmly back up to the starting handstand position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Traps'],
    videoUrl: 'https://www.youtube.com/embed/C2oWkX9aJ6E'
  },
  {
    id: 'plank-to-push-up',
    name: 'Plank to Push-Up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A dynamic exercise that transitions between a forearm plank and a high plank, strengthening the core, chest, and triceps.',
    instructions: [
      'Start in a forearm plank position.', 
      'Place one hand on the floor and push up, followed by the other hand, to move into a high plank (push-up) position.', 
      'Lower back down to your forearms, one arm at a time.', 
      'Alternate which arm you start with for each rep.'
    ],
    muscleGroups: ['Triceps', 'Abdominals', 'Shoulders', 'Chest'],
    videoUrl: 'https://www.youtube.com/embed/x_t_c0Pftg8',
    keywords: ['up-downs']
  },
  {
    id: 'chin-ups',
    name: 'Chin-Ups',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A classic pulling exercise using an underhand grip that primarily targets the biceps and lats. Requires a pull-up bar.',
    instructions: [
      'Grab a pull-up bar with an underhand grip (palms facing you), hands shoulder-width apart.', 
      'Hang with your arms fully extended.', 
      'Pull your body up until your chin is over the bar, focusing on using your biceps and back.', 
      'Lower yourself back down with control.'
    ],
    muscleGroups: ['Biceps', 'Lats', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/mxP7_dZg8I'
  },
  {
    id: 'bodyweight-curls',
    name: 'Bodyweight Curls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'A creative way to perform a bicep curl using your own bodyweight and an object like a towel.',
    instructions: [
      'Sit on the floor and loop a towel under one foot.', 
      'Hold the ends of the towel with both hands.', 
      'Lean back slightly and lift your foot off the floor.', 
      'Curl your hands towards your shoulders, using your bicep strength to pull against the resistance of your leg.', 
      'Lower with control.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/p-85PGCe34c'
  },
  {
    id: 'close-grip-push-ups',
    name: 'Close-Grip Push-Ups',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A push-up variation with hands placed closer than shoulder-width, shifting the emphasis to the triceps.',
    instructions: [
      'Assume a push-up position with your hands directly under your shoulders or slightly closer.', 
      'Keep your elbows tucked into your sides as you lower your body.', 
      'Press back up, focusing on the contraction in your triceps.', 
      'Maintain a straight body line from head to heels.'
    ],
    muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/pyeDb3_N6PI'
  },
  {
    id: 'knee-push-up',
    name: 'Knee Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A modified push-up performed on the knees, making it an excellent starting point for building upper body strength.',
    instructions: [
      'Start in a plank position on your knees, with hands under your shoulders.', 
      'Keep your body in a straight line from your head to your knees.', 
      'Lower your chest towards the floor, keeping your elbows close to your body.', 
      'Push back up to the starting position.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/jWxvty2KROs',
    keywords: ['modified push-up']
  },
  {
    id: 'push-up',
    name: 'Standard Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A classic upper body exercise that builds chest, shoulder, and triceps strength.',
    instructions: [
      'Start in a plank position with hands slightly wider than your shoulders.',
      'Lower your body until your chest nearly touches the floor, keeping your back straight.',
      'Push yourself back up to the starting position.',
      'For an easier variation, perform on your knees.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    keywords: ['press-up']
  },
  {
    id: 'triceps-dip',
    name: 'Triceps Dip',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A bodyweight exercise using a bench or chair to isolate and strengthen the triceps muscles.',
    instructions: [
      'Sit on the edge of a bench or chair with your hands gripping the edge, fingers forward.', 
      'Slide your hips forward off the bench.', 
      'Lower your body by bending your elbows until they are at a 90-degree angle.', 
      'Push through your palms to raise your body back to the start.'
    ],
    muscleGroups: ['Triceps', 'Shoulders', 'Chest'],
    videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM',
    keywords: ['bench dip']
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'An advanced push-up variation that shifts the focus to the shoulders by performing the movement in a pike position.',
    instructions: [
      'Start in a downward dog yoga pose, with your hips high and body in an inverted "V" shape.', 
      'Bend your elbows to lower the top of your head towards the floor.', 
      'Keep your legs straight and hips high.', 
      'Push back up to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/6_H-1_rT-Uo'
  },
  {
    id: 'archer-push-up',
    name: 'Archer Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'An advanced unilateral push-up that builds strength for the one-arm push-up by shifting weight to one side while the other arm provides support.',
    instructions: [
      'Start in a wide push-up position.', 
      'Lower your body towards one hand, keeping that elbow tucked in.', 
      'The opposite arm will straighten out to the side for support, like an archer drawing a bow.', 
      'Push back up to the center and repeat on the other side.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/6FB3Bv_iiG0'
  },
  {
    id: 'banded-bicep-curls',
    name: 'Banded Bicep Curls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'A simple and effective exercise to isolate and build the bicep muscles using a resistance band.',
    instructions: [
      'Stand on the middle of the band with one or both feet.',
      'Hold the ends of the band with an underhand grip, arms extended.',
      'Curl your hands up towards your shoulders, squeezing your biceps.',
      'Slowly lower your hands back to the starting position.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/kxXvDEd21ho',
    keywords: ['arm curl']
  },
  {
    id: 'banded-hammer-curls',
    name: 'Banded Hammer Curls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'A variation of the bicep curl that uses a neutral (hammer) grip, targeting the brachialis and brachioradialis muscles in addition to the biceps.',
    instructions: [
      'Stand on the middle of the band with one or both feet.',
      'Hold the ends of the band with a neutral grip (palms facing each other).',
      'Keeping your elbows pinned to your sides, curl your hands up towards your shoulders.',
      'Squeeze at the top, then slowly lower your hands back down.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/AzbZgPAJ_I8',
    keywords: ['neutral grip curl']
  },
  {
    id: 'banded-tricep-kickbacks',
    name: 'Banded Tricep Kickbacks',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the triceps by extending the arm against the band\'s resistance from a hinged position.',
    instructions: [
      'Anchor the band to a low point or stand on it with one foot.',
      'Hinge at your hips, keeping your back straight. Hold the band with the opposite hand.',
      'Bring your elbow up so your upper arm is parallel to the floor.',
      'Extend your arm straight back, squeezing your tricep. Keep your upper arm stationary.',
      'Slowly return to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/p1q5cE0gIe8'
  },
  {
    id: 'banded-overhead-tricep-extensions',
    name: 'Banded Overhead Tricep Extensions',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An excellent exercise for targeting the triceps muscles, performed overhead with a resistance band.',
    instructions: [
      'Stand on one end of the band or anchor it securely under your foot.',
      'Hold the other end with both hands and extend your arms straight overhead.',
      'Keeping your elbows close to your head, lower the band behind your head by bending your elbows.',
      'Extend your arms to return to the starting position.'
    ],
    muscleGroups: ['Triceps', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/QAk634A5S8Y',
    keywords: ['overhead tricep extension']
  },
  {
    id: 'banded-push-ups',
    name: 'Banded Push-Ups',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'Increases the difficulty of a standard push-up by adding accommodating resistance from a band, making the top of the movement more challenging.',
    instructions: [
      'Drape a resistance band across your upper back, holding the ends under your hands.',
      'Assume a standard push-up position.',
      'Perform a push-up. The band will add resistance as you push away from the floor.',
      'Maintain a straight body line throughout the movement.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/p9_b-2k-L9E'
  },
  {
    id: 'banded-chest-press',
    name: 'Banded Chest Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A versatile exercise that mimics a bench press using a resistance band to strengthen the chest, shoulders, and triceps.',
    instructions: [
      'Wrap the band around your upper back, holding an end in each hand.',
      'Lie on your back or stand in a staggered stance.',
      'Press your hands forward and together, extending your arms and squeezing your chest.',
      'Slowly return to the starting position.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/s3gn_16yD-s'
  },
  {
    id: 'banded-chest-fly',
    name: 'Banded Chest Fly',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise for the chest that uses a band to create tension throughout the entire range of motion.',
    instructions: [
      'Anchor the band to a sturdy object at chest height.',
      'Stand sideways to the anchor and grab the band with the hand farthest from it.',
      'Step away to create tension, with your arm extended to the side.',
      'With a slight bend in your elbow, bring your arm across your body in a wide arc, squeezing your chest.',
      'Slowly return to the start and repeat.'
    ],
    muscleGroups: ['Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/Z575G8s0-cE'
  },
  {
    id: 'banded-rows',
    name: 'Banded Rows',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A fundamental back exercise that strengthens the lats, rhomboids, and biceps, improving posture.',
    instructions: [
      'Sit on the floor with your legs extended, and loop the band around your feet.',
      'Hold the ends of the band with a neutral grip.',
      'Keeping your back straight, pull the band towards your torso, squeezing your shoulder blades together.',
      'Slowly extend your arms to return to the start.'
    ],
    muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/UmDMofb_MMI',
    keywords: ['seated row']
  },
  {
    id: 'banded-lat-pulldown',
    name: 'Banded Lat Pulldown',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'Mimics the lat pulldown machine, targeting the latissimus dorsi muscles to build back width.',
    instructions: [
      'Anchor a band to a high point, like the top of a door.',
      'Kneel or sit facing the anchor, holding the band with both hands.',
      'Keeping your chest up and back straight, pull the band down towards your upper chest, squeezing your lats.',
      'Slowly release the tension to return to the start.'
    ],
    muscleGroups: ['Lats', 'Biceps', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/p5Sj6i2mS38'
  },
  {
    id: 'banded-face-pulls',
    name: 'Banded Face Pulls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'An excellent exercise for improving posture and strengthening the rear deltoids, rhomboids, and external rotators of the shoulder.',
    instructions: [
      'Anchor the band at chest or head height.',
      'Hold the band with an overhand grip, arms extended.',
      'Pull the band towards your face, leading with your elbows.',
      'As you pull, externally rotate your shoulders so your knuckles face the ceiling at the end of the movement.',
      'Squeeze your shoulder blades together, then slowly return.'
    ],
    muscleGroups: ['Shoulders', 'Traps', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/mG_f-j-1M3A'
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Aparts',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'A fantastic exercise for shoulder health, posture, and strengthening the upper back muscles.',
    instructions: [
      'Hold a light resistance band with both hands, palms facing down, hands shoulder-width apart.',
      'Extend your arms straight out in front of you at shoulder height.',
      'Keeping your arms straight, pull the band apart by squeezing your shoulder blades together.',
      'Slowly return to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/okR_2_4w5yI'
  },
  {
    id: 'banded-overhead-shoulder-press',
    name: 'Banded Overhead Shoulder Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A shoulder-strengthening exercise that uses a resistance band to build deltoid and tricep strength.',
    instructions: [
      'Stand on the middle of the band with feet shoulder-width apart.',
      'Hold the ends of the band at shoulder height, palms facing forward.',
      'Press the band straight overhead until your arms are fully extended.',
      'Slowly lower the band back to your shoulders.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/s_u1pBKN-k4',
    keywords: ['shoulder press']
  },
  {
    id: 'banded-front-raises',
    name: 'Banded Front Raises',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the anterior (front) deltoid muscles of the shoulder.',
    instructions: [
      'Stand on the band with one or both feet.',
      'Hold the band with an overhand grip at thigh level.',
      'Keeping your arm straight, raise the band in front of you up to shoulder height.',
      'Slowly lower the band back down with control.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/p5Sj6i2mS38'
  },
  {
    id: 'banded-lateral-raises',
    name: 'Banded Lateral Raises',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'Targets the medial (side) deltoid, helping to build shoulder width and roundness.',
    instructions: [
      'Stand on the band with one or both feet.',
      'Hold the ends of the band at your sides with a neutral grip.',
      'With a slight bend in your elbows, raise your arms out to your sides up to shoulder height.',
      'Slowly lower your arms back to the start.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/p5Sj6i2mS38'
  },
  {
    id: 'banded-wrist-curls',
    name: 'Banded Wrist Curls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'Strengthens the wrist flexor muscles in the forearms, improving grip strength.',
    instructions: [
      'Sit and place your forearm on your thigh, palm facing up. Stand on the band with your foot.',
      'Hold the other end of the band in your hand.',
      'Let your wrist hang down, then curl your wrist upwards, squeezing your forearm.',
      'Slowly lower your wrist back down.'
    ],
    muscleGroups: ['Forearms'],
    videoUrl: 'https://www.youtube.com/embed/3VltTRZGRjM'
  },
  {
    id: 'banded-reverse-wrist-curls',
    name: 'Banded Reverse Wrist Curls',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'Strengthens the wrist extensor muscles, helping to balance the forearm and prevent injuries.',
    instructions: [
      'Sit and place your forearm on your thigh, palm facing down. Stand on the band with your foot.',
      'Hold the other end of the band in your hand.',
      'Let your wrist hang down, then extend your wrist upwards.',
      'Slowly lower your wrist back down.'
    ],
    muscleGroups: ['Forearms'],
    videoUrl: 'https://www.youtube.com/embed/LV8wbk-c85k'
  },
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A foundational strength exercise for developing the chest, shoulders, and triceps.',
    instructions: [
      'Lie on a flat bench with your feet firmly on the floor.',
      'Grip the barbell with hands slightly wider than shoulder-width.',
      'Unrack the bar and lower it to your mid-chest.',
      'Press the bar back up to the starting position, extending your arms fully.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/rT7DgL3pbfU'
  },
  {
    id: 'barbell-shrugs',
    name: 'Barbell Shrugs',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that specifically targets and builds the trapezius muscles.',
    instructions: [
      'Stand holding a barbell with an overhand grip, hands shoulder-width apart.',
      'Let the barbell hang at arm\'s length in front of you.',
      'Elevate your shoulders straight up towards your ears as high as possible.',
      'Hold the peak contraction, then slowly lower the barbell back to the start.'
    ],
    muscleGroups: ['Traps'],
    videoUrl: 'https://www.youtube.com/embed/NAqCVe2mwqM'
  },


  // LOWER BODY
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A fundamental lower body movement that strengthens legs and glutes.',
    instructions: [
      'Stand with your feet shoulder-width apart.',
      'Lower your hips back and down as if sitting in a chair.',
      'Keep your chest up and back straight.',
      'Go as low as you can comfortably, then push through your heels to return to the start.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/C_VtOYc6j5c',
    keywords: ['air squat']
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'A foundational exercise for activating and strengthening the glutes and hamstrings.',
    instructions: [
      'Lie on your back with your knees bent, feet flat on the floor, and arms by your sides.', 
      'Engage your core and glutes.', 
      'Lift your hips off the floor until your body forms a straight line from your shoulders to your knees.', 
      'Squeeze your glutes at the top, then slowly lower your hips back down.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/wPM8icPu6H8'
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'An advanced variation of the glute bridge that increases the load on one leg, improving unilateral strength and stability.',
    instructions: [
      'Lie on your back in a glute bridge starting position.', 
      'Extend one leg straight out.', 
      'Push through the heel of the foot on the floor to lift your hips off the ground.', 
      'Keep your hips level and avoid arching your back.', 
      'Lower down with control and repeat for reps before switching sides.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/5nO9_92GjR4'
  },
  {
    id: 'forward-lunge',
    name: 'Forward Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A classic unilateral exercise that strengthens the quads, glutes, and hamstrings while improving balance.',
    instructions: [
      'Stand with your feet together.', 
      'Take a large step forward with one foot.', 
      'Lower your hips until both knees are bent at a 90-degree angle.', 
      'Ensure your front knee is directly above your ankle.', 
      'Push off your front foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/QE_hCh_vrxM'
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A lunge variation that is often easier on the knees and helps improve balance and single-leg strength.',
    instructions: [
      'Stand with your feet together.', 
      'Step one foot straight back, landing on the ball of your foot.', 
      'Lower both knees to a 90-degree angle, keeping your front knee aligned over your ankle.', 
      'Push off your back foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/oYiBDWhmrX8',
    keywords: ['step-back lunge']
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A dynamic lunge that involves stepping forward into each repetition, challenging balance and coordination more than a static lunge.',
    instructions: [
      'Stand with feet together.', 
      'Step forward with one foot and lower into a lunge, with both knees at 90-degree angles.', 
      'Push off your back foot and step it forward to meet your front foot.', 
      'Repeat, stepping forward with the opposite leg.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/L8fvypoZc7c'
  },
  {
    id: 'step-ups',
    name: 'Step-Ups',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A functional exercise that targets the quads and glutes, improving single-leg strength and balance. Can be done on a box, bench, or stairs.',
    instructions: [
      'Stand in front of a sturdy, elevated surface like a bench or box.', 
      'Step up with one foot, pressing through your heel to lift your body up.', 
      'Bring the other foot to meet it on top of the surface.', 
      'Step back down with the same leading foot. Alternate leading legs for each set.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/d_dt_1cntYI'
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Cardio/HIIT',
    description: 'A plyometric exercise that adds an explosive jump to the standard squat, building power and cardiovascular endurance.',
    instructions: [
      'Start with your feet shoulder-width apart.', 
      'Lower into a squat position.', 
      'From the bottom of the squat, explode upwards into a jump.', 
      'Land softly, immediately absorbing the impact by going into your next squat.', 
      'Keep your chest up and back straight.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/A-cFYWvaHr0'
  },
  {
    id: 'pistol-squats',
    name: 'Pistol Squats',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A highly advanced single-leg squat that requires exceptional strength, balance, and mobility.',
    instructions: [
      'Stand on one leg with the other leg extended straight out in front of you.', 
      'Keeping your back straight, lower yourself down into a full squat on your standing leg.', 
      'Go as low as you can, ideally until your hamstring rests on your calf.', 
      'Push through your heel to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/79-o-gMPK_4',
    keywords: ['single leg squat']
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'A simple but effective isolation exercise for strengthening the calf muscles.',
    instructions: [
      'Stand with your feet flat on the floor, hip-width apart.', 
      'Press through the balls of your feet to raise your heels as high as you can.', 
      'Squeeze your calf muscles at the top.', 
      'Slowly lower your heels back to the floor. For an increased range of motion, perform on a step.'
    ],
    muscleGroups: ['Calves'],
    videoUrl: 'https://www.youtube.com/embed/Jfl_gSok4kQ'
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Isolation',
    description: 'An isometric exercise that builds endurance in the quadriceps, glutes, and hamstrings.',
    instructions: [
      'Stand with your back against a wall.', 
      'Walk your feet forward and slide your back down the wall until your knees are at a 90-degree angle.', 
      'Ensure your knees are directly above your ankles.', 
      'Keep your back flat against the wall and hold the position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/y-wV4j5-o_s'
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A fundamental squat variation holding a dumbbell at chest level, great for learning proper squat form while strengthening the lower body and core.',
    instructions: [
      'Stand with your feet slightly wider than shoulder-width apart, toes pointed slightly out.',
      'Hold one end of a dumbbell vertically with both hands at your chest.',
      'Keeping your back straight and chest up, lower your hips back and down as if sitting in a chair.',
      'Go as low as you can comfortably, then push through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/MeW_P-avd48',
    keywords: ['db squat']
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A single-leg squat variation with the rear foot elevated, increasing the challenge on the front leg and improving stability.',
    instructions: [
      'Stand a few feet in front of a bench or chair.', 
      'Place the top of one foot on the bench behind you.', 
      'Lower your hips until your front thigh is parallel to the ground.', 
      'Keep your torso upright and push through your front heel to return to the start.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE',
    keywords: ['rear-foot elevated split squat']
  },
  {
    id: 'assisted-pistol-squat',
    name: 'Pistol Squat (Assisted)',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Compound',
    description: 'A single-leg squat performed to full depth. This assisted version uses support to help with balance and strength.',
    instructions: [
      'Stand on one leg, holding onto a door frame, pole, or TRX for support.', 
      'Extend the other leg straight out in front of you.', 
      'Lower yourself down into a full squat on the standing leg, using your arms for balance and assistance.', 
      'Push through your heel to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/1_4z61g1-kQ',
    keywords: ['single leg squat']
  },
  {
    id: 'banded-squats',
    name: 'Banded Squats',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'Adds resistance to the standard bodyweight squat, increasing the challenge for the glutes, quads, and hamstrings.',
    instructions: [
      'Stand on the band with your feet shoulder-width apart.',
      'Loop the other end of the band over your shoulders or hold it at shoulder height (goblet style).',
      'Perform a squat, keeping your chest up and back straight.',
      'Drive through your heels to return to the standing position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/922kNIi022Q'
  },
  {
    id: 'banded-step-ups',
    name: 'Banded Step-Ups',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A unilateral leg exercise that targets the quads and glutes, with added band resistance for increased difficulty.',
    instructions: [
      'Loop a band under the foot that will remain on the floor. Hold the other end at shoulder height.',
      'Place your other foot on a sturdy bench or box.',
      'Step up onto the bench, driving through the heel of your elevated foot.',
      'Step back down with control. Complete reps on one side before switching.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/6ECp-d326Hw'
  },
  {
    id: 'banded-leg-press',
    name: 'Banded Leg Press',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A creative way to mimic the leg press machine, targeting the quads, glutes, and hamstrings.',
    instructions: [
      'Lie on your back and loop a resistance band around the arches of your feet.',
      'Hold the ends of the band securely in your hands, anchored by your sides.',
      'Bring your knees towards your chest to a 90-degree angle.',
      'Press your feet away from you, extending your legs against the band\'s resistance.',
      'Slowly return your knees to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/s0G2zaflk9E'
  },
  {
    id: 'banded-glute-bridges',
    name: 'Banded Glute Bridges',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'Targets the glutes and hamstrings, with a mini-band adding resistance to engage the hip abductors.',
    instructions: [
      'Place a mini-band around your legs, just above your knees.',
      'Lie on your back with your knees bent and feet flat on the floor.',
      'Drive your hips up towards the ceiling, squeezing your glutes.',
      'Keep your knees pressed outwards against the band. Hold for a moment, then lower your hips.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Abductors'],
    videoUrl: 'https://www.youtube.com/embed/5VSy_7dC5uA'
  },
  {
    id: 'banded-hip-thrusts',
    name: 'Banded Hip Thrusts',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A powerful glute-building exercise that can be done with a long resistance band for added resistance.',
    instructions: [
      'Sit on the floor with your upper back against a bench. Loop a band over your hips and anchor it under your feet.',
      'Place your feet flat on the floor, knees bent.',
      'Drive your hips upwards, squeezing your glutes, until your body forms a straight line from shoulders to knees.',
      'Lower your hips back down with control.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/t-w8k-sgh9M'
  },
  {
    id: 'banded-standing-kickbacks',
    name: 'Banded Standing Kickbacks',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the gluteus maximus, helping to shape and strengthen the glutes.',
    instructions: [
      'Anchor a band to a low point or loop it around your ankles.',
      'Stand facing the anchor, holding onto something for balance if needed.',
      'Keeping your leg straight, kick it back behind you, squeezing your glute at the peak of the movement.',
      'Return your leg to the start with control. Complete reps on one side, then switch.'
    ],
    muscleGroups: ['Glutes'],
    videoUrl: 'https://www.youtube.com/embed/yP3u-yBNi-E'
  },
  {
    id: 'banded-deadlifts',
    name: 'Banded Deadlifts',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Compound',
    description: 'A variation of the deadlift that uses a band to provide accommodating resistance, focusing on the hamstrings and glutes.',
    instructions: [
      'Stand on a long resistance band with feet hip-width apart.',
      'Hinge at your hips, keeping your back straight, and grab the band with both hands.',
      'Drive your hips forward to stand up straight, squeezing your glutes at the top.',
      'Slowly hinge at the hips to lower back down.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/T4oG-fAmdkY'
  },
  {
    id: 'banded-hamstring-curls',
    name: 'Banded Hamstring Curls',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the hamstrings, great for building strength and preventing injury.',
    instructions: [
      'Anchor a band to a low point.',
      'Lie on your stomach and loop the other end of the band around one ankle.',
      'Curl your heel towards your glute against the band\'s resistance.',
      'Slowly extend your leg back to the starting position.'
    ],
    muscleGroups: ['Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/YR08P-4vYqs'
  },
  {
    id: 'banded-lateral-walks',
    name: 'Banded Lateral Walks',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Core/Accessory',
    description: 'An excellent warm-up or accessory exercise for glute activation and hip stability.',
    instructions: [
      'Place a mini-band around your ankles or just above your knees.',
      'Assume an athletic stance with knees slightly bent.',
      'Take a step to one side, keeping tension on the band.',
      'Follow with the other foot, maintaining the stance. Repeat for desired reps, then switch directions.'
    ],
    muscleGroups: ['Glutes', 'Abductors'],
    videoUrl: 'https://www.youtube.com/embed/a79_hVe-7G8',
    keywords: ['monster walk', 'band walk']
  },
  {
    id: 'banded-monster-walks',
    name: 'Banded Monster Walks',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Core/Accessory',
    description: 'A dynamic exercise that targets the gluteus medius and improves hip stability by walking forward and backward with a band.',
    instructions: [
      'Place a band around your ankles or thighs.',
      'Get into a half-squat position.',
      'Walk forward by taking wide, deliberate steps, keeping tension on the band.',
      'After a few steps, walk backward to the starting position.'
    ],
    muscleGroups: ['Glutes', 'Abductors'],
    videoUrl: 'https://www.youtube.com/embed/hB5P-6TbfI4'
  },
  {
    id: 'banded-side-lying-leg-raises',
    name: 'Banded Side-Lying Leg Raises',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'An isolation exercise that strengthens the hip abductors, particularly the gluteus medius.',
    instructions: [
      'Place a mini-band around your ankles.',
      'Lie on your side with your legs straight and stacked.',
      'Keeping your top leg straight, raise it as high as you can against the band\'s resistance.',
      'Slowly lower the leg back down.'
    ],
    muscleGroups: ['Abductors', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/j7a8cV-yJ3I',
    keywords: ['clamshells']
  },
  {
    id: 'banded-standing-adduction',
    name: 'Banded Standing Adduction',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'Targets the inner thigh muscles (adductors) by pulling your leg across your body against resistance.',
    instructions: [
      'Anchor a band to a low point. Loop the other end around the ankle of your inside leg.',
      'Stand with your side to the anchor point, holding onto something for support.',
      'Pull your ankle across the front of your standing leg, squeezing your inner thigh.',
      'Slowly return to the starting position.'
    ],
    muscleGroups: ['Adductors'],
    videoUrl: 'https://www.youtube.com/embed/jAPkFCKpj24'
  },
  {
    id: 'banded-seated-leg-adduction',
    name: 'Banded Seated Leg Adduction',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
    workoutType: 'Isolation',
    description: 'A seated variation to isolate the inner thigh muscles.',
    instructions: [
      'Sit on a chair or bench with a mini-band looped around your thighs, just above the knees.',
      'Start with your feet flat on the floor and knees apart, creating tension in the band.',
      'Squeeze your knees together against the resistance of the band.',
      'Slowly allow your knees to move apart again.'
    ],
    muscleGroups: ['Adductors'],
    videoUrl: 'https://www.youtube.com/embed/Yp28jpyJMpY'
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A core strength exercise that involves squatting with a barbell resting on the upper back, building powerful legs and a strong core.',
    instructions: [
      'Position a barbell on a squat rack at shoulder height.',
      'Step under the bar and rest it across your upper back. Grip the bar with hands wider than your shoulders.',
      'Lift the bar off the rack and step back. Stand with feet shoulder-width apart.',
      'Lower your hips back and down, keeping your chest up and back straight.',
      'Push through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8'
  },


  // CORE
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'A classic abdominal exercise that targets the rectus abdominis muscle.',
    instructions: [
      'Lie on your back with your knees bent and feet flat on the floor.', 
      'Place your hands behind your head or across your chest.', 
      'Lift your head and shoulder blades off the floor, contracting your abs.', 
      'Keep your lower back pressed into the floor.', 
      'Lower back down with control.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU'
  },
  {
    id: 'leg-raises',
    name: 'Leg Raises',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'An exercise that targets the lower abdominal muscles.',
    instructions: [
      'Lie on your back with your legs straight and together.', 
      'Place your hands under your lower back for support.', 
      'Keeping your legs straight, raise them towards the ceiling until they are perpendicular to the floor.', 
      'Slowly lower your legs back down without letting them touch the floor.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/l4kQd9eWclE',
    keywords: ['leg lifts']
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'An isometric exercise that targets the obliques and improves core stability.',
    instructions: [
      'Lie on your side with your legs straight.', 
      'Prop your body up on your forearm, ensuring your elbow is directly under your shoulder.', 
      'Lift your hips until your body forms a straight line from your ankles to your head.', 
      'Hold the position for the desired time and repeat on the other side.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/K2VljzCC16Y'
  },
  {
    id: 'flutter-kicks',
    name: 'Flutter Kicks',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'A dynamic core exercise that targets the lower abs and hip flexors.',
    instructions: [
      'Lie on your back with your legs extended and hands under your lower back for support.', 
      'Lift your heels about 6 inches off the floor.', 
      'Make small, rapid up-and-down scissor-like motions with your legs.', 
      'Keep your core engaged and lower back pressed into the floor.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/ANVdMDaYRts'
  },
  {
    id: 'v-ups',
    name: 'V-Ups',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'An advanced core exercise that works both the upper and lower abs simultaneously.',
    instructions: [
      'Lie on your back with your arms and legs extended.', 
      'In one explosive movement, simultaneously lift your torso and legs up to form a "V" shape with your body.', 
      'Reach your hands towards your feet.', 
      'Lower back down with control.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/iP2fjvG_xMw'
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'A simple but effective isometric exercise that strengthens the entire core, as well as shoulders and glutes.',
    instructions: [
      'Place your forearms on the floor with elbows aligned below shoulders.', 
      'Extend your legs back, resting on your toes.', 
      'Keep your body in a straight line from head to heels, engaging your core and glutes.', 
      'Hold the position without letting your hips sag.'
    ],
    muscleGroups: ['Abdominals', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c'
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Cardio/HIIT',
    description: 'A dynamic, high-intensity exercise that combines a plank with running knees, targeting the core and elevating heart rate.',
    instructions: [
      'Start in a high plank position with hands under your shoulders.', 
      'Engage your core and bring one knee towards your chest.', 
      'Quickly switch legs, bringing the other knee forward.', 
      'Continue alternating legs at a fast pace as if running in place.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/nmwgirg2B5s'
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    workoutType: 'Core/Accessory',
    description: 'A foundational gymnastics exercise that builds immense core strength and stability by holding a challenging, braced position.',
    instructions: [
      'Lie on your back with your arms and legs extended.', 
      'Simultaneously lift your arms, head, shoulders, and legs off the floor.', 
      'Press your lower back firmly into the ground, creating a "hollow" or banana shape with your body.', 
      'Hold this position, keeping your core tight.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/B43v_j_2S24',
    keywords: ['hollow hold', 'hollow rock']
  },
  {
    id: 'banded-pallof-press',
    name: 'Banded Pallof Press',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Core/Accessory',
    description: 'An anti-rotation core exercise that builds stability by resisting a rotational force from a resistance band.',
    instructions: [
      'Anchor a band at chest height.',
      'Stand sideways to the anchor and hold the band with both hands at your chest.',
      'Step away from the anchor to create tension.',
      'Press the band straight out in front of you, resisting the urge to twist. Hold, then return to your chest.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/6u_0kY-kYJU'
  },
  {
    id: 'banded-woodchoppers',
    name: 'Banded Woodchoppers',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    workoutType: 'Core/Accessory',
    description: 'A rotational exercise that targets the obliques and improves core power, mimicking a chopping motion.',
    instructions: [
      'Anchor a band to a high point. Stand sideways to the anchor.',
      'Grab the band with both hands and pull it down and across your body towards your opposite knee.',
      'Pivot your feet and rotate your torso as you perform the movement.',
      'Control the band as you return to the starting position.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/VLmQyBf2_aI'
  },

  // FULL BODY
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'kettlebell',
    workoutType: 'Compound',
    description: 'A powerful hip-hinge movement that develops explosive power, strength, and cardio.',
    instructions: [
      'Stand with feet shoulder-width apart, holding the kettlebell with both hands.',
      'Hinge at your hips, allowing the kettlebell to swing back between your legs.',
      'Explosively drive your hips forward to propel the kettlebell up to chest height.',
      'Let gravity bring the kettlebell back down into the next swing.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Abdominals', 'Lower Back', 'Lats'],
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8'
  },
  {
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A compound lift that builds total-body strength by lifting a loaded barbell off the floor.',
    instructions: [
      'Stand with your mid-foot under the barbell.',
      'Hinge at your hips and bend your knees to grip the bar with hands just outside your legs.',
      'Keep your back straight, chest up, and look forward.',
      'Drive through your heels to lift the weight, keeping the bar close to your body.',
      'Stand up tall, then reverse the motion to lower the bar with control.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/VL5Ab0T07e4'
  },


  // COOL-DOWN
  {
    id: 'overhead-triceps-stretch',
    name: 'Overhead Triceps Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A static stretch to relieve tension in the triceps muscle at the back of the upper arm.',
    instructions: [
      'Raise one arm straight overhead.',
      'Bend your elbow and let your hand fall behind your head.',
      'Use your other hand to gently pull the elbow towards the midline of your body.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Triceps', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/3n_rB5GIOe0'
  },
  {
    id: 'cross-body-shoulder-stretch',
    name: 'Cross-Body Shoulder Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A common stretch to target the deltoid (shoulder) muscles, particularly the posterior head.',
    instructions: [
        'Bring one arm straight across your chest.',
        'Use your other hand to gently pull the arm closer to your body.',
        'Hold the stretch for 20-30 seconds, feeling it in your shoulder.',
        'Release and repeat on the other side.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/6kPc64sDs40'
  },
  {
    id: 'chest-doorway-stretch',
    name: 'Chest Doorway Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'Opens up the chest muscles and improves posture, especially after pressing movements.',
    instructions: [
      'Stand in a doorway.',
      'Place your forearms on the frame with your elbows bent at a 90-degree angle.',
      'Gently step forward with one foot until you feel a stretch in your chest and shoulders.',
      'Hold for 20-30 seconds.'
    ],
    muscleGroups: ['Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/NSi8_22dG9E',
    keywords: ['doorway stretch']
  },
  {
    id: 'upper-back-stretch',
    name: 'Upper Back Stretch (Hands Clasped Forward)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A simple stretch to relieve tension in the upper back and between the shoulder blades.',
    instructions: [
        'Stand or sit tall.',
        'Clasp your hands together and extend your arms straight out in front of you.',
        'Round your upper back and shoulders, tucking your chin to your chest.',
        'Feel the stretch between your shoulder blades and hold for 20-30 seconds.'
    ],
    muscleGroups: ['Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/mjz_bL_Pl-g'
  },
  {
    id: 'neck-side-stretch',
    name: 'Neck Side Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A gentle stretch to release tension in the side of the neck and upper trapezius muscles.',
    instructions: [
        'Sit or stand tall.',
        'Gently tilt your head to one side, bringing your ear towards your shoulder.',
        'For a deeper stretch, you can gently place your hand on the side of your head.',
        'Hold for 15-20 seconds, then repeat on the other side. Do not force the stretch.'
    ],
    muscleGroups: ['Traps', 'Neck'],
    videoUrl: 'https://www.youtube.com/embed/2-3_aK2b-iI'
  },
  {
    id: 'cobra-stretch',
    name: 'Cobra Stretch (Abdominals)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A yoga pose that stretches the abdominal muscles and improves spinal extension.',
    instructions: [
        'Lie on your stomach with your hands under your shoulders.',
        'Gently press through your hands to lift your chest off the floor, keeping your hips on the ground.',
        'Look forward and keep your shoulders relaxed, away from your ears.',
        'Hold for 15-30 seconds. Lower down gently.'
    ],
    muscleGroups: ['Abdominals', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/jdB_zCtq8-8'
  },
  {
    id: 'childs-pose',
    name: 'Child’s Pose',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A gentle resting pose that stretches the lower back, hips, and thighs.',
    instructions: [
        'Kneel on the floor, sit back on your heels, then fold forward.',
        'Rest your forehead on the floor and extend your arms forward or rest them alongside your body.',
        'Breathe deeply and relax into the stretch.',
        'Hold for 30-60 seconds.'
    ],
    muscleGroups: ['Lower Back', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/2vJKOz_f_A4'
  },
  {
    id: 'seated-side-bend-stretch',
    name: 'Seated Side Bend Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'Stretches the obliques, lats, and muscles along the side of the torso.',
    instructions: [
        'Sit comfortably on the floor with your legs crossed.',
        'Place one hand on the floor for support and reach the other arm overhead.',
        'Gently bend to the side, feeling a stretch along your torso.',
        'Hold for 20-30 seconds and switch sides.'
    ],
    muscleGroups: ['Obliques', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/c0-e_a-WRjQ'
  },
  {
    id: 'standing-side-stretch',
    name: 'Standing Side Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A standing stretch that lengthens the muscles along the side of the body, including the obliques and lats.',
    instructions: [
        'Stand with your feet together.',
        'Reach your arms overhead and clasp your hands.',
        'Gently lean your upper body to one side, keeping your core engaged.',
        'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Obliques'],
    videoUrl: 'https://www.youtube.com/embed/c0-e_a-WRjQ'
  },
  {
    id: 'lying-spinal-twist',
    name: 'Lying Spinal Twist',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A relaxing stretch that improves spinal mobility and can help relieve lower back tension.',
    instructions: [
        'Lie on your back and bring one knee into your chest.',
        'Extend your opposite arm out to the side.',
        'Gently guide your bent knee across your body towards the floor.',
        'Keep both shoulders on the ground if possible. Hold for 30 seconds and switch sides.'
    ],
    muscleGroups: ['Lower Back', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/k9P22R_7hG8'
  },
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A static stretch to improve flexibility in the quadriceps muscles at the front of the thigh.',
    instructions: [
      'Stand upright, holding onto a wall or chair for balance if needed.',
      'Grab your right foot and gently pull your heel up and back towards your glute.',
      'Keep your knees close together and your back straight.',
      'Hold the stretch for 20-30 seconds, feeling it in the front of your thigh.',
      'Release and repeat on the other side.'
    ],
    muscleGroups: ['Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/hL_p_RhVp-Q',
    keywords: ['quadriceps stretch']
  },
  {
    id: 'seated-hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A static stretch to increase flexibility in the hamstrings, located at the back of the thigh.',
    instructions: [
      'Sit on the floor with one leg extended straight out.',
      'Bend the other leg, placing the sole of your foot against your inner thigh.',
      'Hinge at your hips and gently lean forward over the straight leg.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/PHYB2a1lA_I'
  },
  {
    id: 'figure-four-glute-stretch',
    name: 'Figure 4 Glute Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A deep stretch for the glutes and piriformis muscle, which can help relieve hip and lower back tightness.',
    instructions: [
        'Lie on your back with your knees bent.',
        'Cross one ankle over the opposite knee, creating a "figure 4" shape.',
        'Reach through the gap and gently pull the supporting thigh towards your chest.',
        'Hold for 30 seconds and switch sides.'
    ],
    muscleGroups: ['Glutes'],
    videoUrl: 'https://www.youtube.com/embed/p8_v_c23-3M'
  },
  {
    id: 'butterfly-stretch',
    name: 'Butterfly Stretch (Adductors)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A seated stretch that targets the inner thighs (adductors) and opens up the hips.',
    instructions: [
        'Sit on the floor and bring the soles of your feet together.',
        'Let your knees fall out to the sides.',
        'Hold onto your ankles and gently press your knees towards the floor with your elbows.',
        'Keep your back straight and hold for 30 seconds.'
    ],
    muscleGroups: ['Adductors'],
    videoUrl: 'https://www.youtube.com/embed/40_nJg-Z-Fw'
  },
  {
    id: 'standing-calf-stretch',
    name: 'Standing Calf Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A crucial stretch for jumpers to relieve tightness in the calf muscles.',
    instructions: [
      'Stand facing a wall with your hands on the wall for support.',
      'Step one foot back, keeping the leg straight and the heel on the floor.',
      'Gently lean forward until you feel a stretch in the calf of your back leg.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Calves'],
    videoUrl: 'https://www.youtube.com/embed/yZtm_4T-RHA',
    keywords: ['gastrocnemius stretch']
  },
  {
    id: 'kneeling-hip-flexor-stretch',
    name: 'Kneeling Hip Flexor Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'Stretches the muscles at the front of the hip, which can get tight from sitting and running.',
    instructions: [
        'Kneel on one knee, with your other foot flat on the floor in front of you (a lunge position).',
        'Keeping your back straight, gently push your hips forward.',
        'You should feel a stretch in the front of the hip of your back leg.',
        'Hold for 20-30 seconds and switch sides.'
    ],
    muscleGroups: ['Hip Flexors', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/gEc_70c_S5U'
  },
  {
    id: 'frog-pose',
    name: 'Frog Pose (Inner Thighs)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'An intense stretch for the inner thighs (adductors) and hips.',
    instructions: [
        'Start on all fours.',
        'Slowly widen your knees out to the sides, keeping your ankles in line with your knees.',
        'Flex your feet and rest on your forearms.',
        'Gently sink your hips back and down towards the floor. Hold for 30-60 seconds.'
    ],
    muscleGroups: ['Adductors', 'Hips'],
    videoUrl: 'https://www.youtube.com/embed/RepZo3wr4hA'
  },
  {
    id: 'forward-fold',
    name: 'Forward Fold (Hamstrings & Lower Back)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A deep stretch for the entire back side of the body, from calves to lower back.',
    instructions: [
        'Stand with your feet hip-width apart.',
        'Hinge at your hips and let your torso hang down towards the floor.',
        'Keep a slight bend in your knees to protect your lower back.',
        'Let your head and neck relax completely. Hold for 30-60 seconds.'
    ],
    muscleGroups: ['Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/g7Uhp5tphAs'
  },
  {
    id: 'pigeon-pose',
    name: 'Pigeon Pose (Glutes & Hips)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'A yoga pose that provides a deep stretch for the hip rotators and glutes.',
    instructions: [
        'Start in a plank or downward dog position.',
        'Bring one knee forward and place it behind the same-side wrist.',
        'Extend your other leg straight back.',
        'Keep your hips square and fold forward over your front leg if comfortable. Hold for 30-60 seconds and switch.'
    ],
    muscleGroups: ['Glutes', 'Hips'],
    videoUrl: 'https://www.youtube.com/embed/0_zPqA65N_E'
  },
  {
    id: 'deep-squat-hold',
    name: 'Deep Squat Hold (Ankles & Hips Mobility)',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    workoutType: 'Mobility/Stretch',
    description: 'An excellent pose for improving hip, knee, and ankle mobility.',
    instructions: [
        'Stand with your feet slightly wider than shoulder-width, toes pointed slightly out.',
        'Lower your hips down into a deep squat, going as low as you can while keeping your heels on the ground.',
        'Use your elbows to gently press your knees apart.',
        'Keep your chest up and back straight. Hold for 30-60 seconds.'
    ],
    muscleGroups: ['Hips', 'Ankles'],
    videoUrl: 'https://www.youtube.com/embed/b-2oV4eYi-8'
  },
  // --- DUMBBELL EXERCISES ---
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A fundamental exercise for building chest, shoulder, and triceps strength, allowing for a natural range of motion.',
    instructions: [
      'Lie on a flat bench with a dumbbell in each hand at your chest, palms facing forward.',
      'Press the dumbbells straight up until your arms are fully extended but not locked.',
      'Slowly lower the dumbbells back to the starting position.',
      'Keep your feet flat on the floor for stability.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
    keywords: ['db bench press', 'chest press']
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the chest muscles, focusing on stretching and contracting the pecs.',
    instructions: [
      'Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing each other.',
      'With a slight bend in your elbows, lower the dumbbells in a wide arc out to your sides until you feel a stretch in your chest.',
      'Use your chest muscles to bring the dumbbells back to the starting position in the same arc motion.'
    ],
    muscleGroups: ['Chest'],
    videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0',
    keywords: ['db fly', 'pec fly']
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'Targets the upper portion of the chest muscles (clavicular head) as well as the front deltoids.',
    instructions: [
      'Set a bench to a 30-45 degree incline and lie back with a dumbbell in each hand.',
      'Hold the dumbbells at shoulder level, palms facing forward.',
      'Press the dumbbells up and slightly inward until your arms are fully extended.',
      'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Chest'],
    videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
    keywords: ['incline db press']
  },
  {
    id: 'decline-dumbbell-press',
    name: 'Decline Dumbbell Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'Targets the lower portion of the chest muscles, often allowing for heavier weight to be lifted.',
    instructions: [
      'Lie on a decline bench, securing your feet. Hold a dumbbell in each hand at your chest.',
      'Press the dumbbells straight up until your arms are fully extended.',
      'Slowly lower the dumbbells back down to your chest.',
      'Keep the movement controlled throughout.'
    ],
    muscleGroups: ['Chest'],
    videoUrl: 'https://www.youtube.com/embed/LfyQBUKR8s4',
    keywords: ['decline db press']
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A unique exercise that works both the chest and the lats, promoting rib cage expansion and upper body flexibility.',
    instructions: [
      'Lie perpendicular on a bench with only your upper back supported, feet firm on the floor.',
      'Hold one dumbbell with both hands in a diamond grip over your chest.',
      'Keeping a slight bend in your elbows, lower the dumbbell in an arc behind your head.',
      'Pull the dumbbell back over your chest using your lats and chest muscles.'
    ],
    muscleGroups: ['Chest', 'Lats'],
    videoUrl: 'https://www.youtube.com/embed/Ydpy9p_I_e0'
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A fundamental exercise for building shoulder strength and size, targeting all three heads of the deltoid.',
    instructions: [
      'Sit on a bench with back support, holding a dumbbell in each hand at shoulder height, palms facing forward.',
      'Press the dumbbells overhead until your arms are fully extended but not locked.',
      'Slowly lower the dumbbells back to the starting position.',
      'Keep your core engaged to protect your back.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5-j_I',
    keywords: ['overhead press', 'db press']
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the medial (side) head of the deltoids, helping to create broader shoulders.',
    instructions: [
      'Stand with a dumbbell in each hand at your sides, palms facing in.',
      'Keeping a slight bend in your elbows and your torso stable, raise your arms out to your sides until they are parallel with the floor.',
      'Slowly lower the dumbbells back to the starting position with control.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    keywords: ['side raise']
  },
  {
    id: 'dumbbell-front-raise',
    name: 'Dumbbell Front Raise',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the anterior (front) head of the deltoids.',
    instructions: [
      'Stand holding a dumbbell in each hand in front of your thighs, palms facing your body.',
      'Keeping your arms straight, raise the dumbbells up in front of you to shoulder height.',
      'Slowly lower them back down with control. You can perform this alternating arms or with both arms at once.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/s_L128dgI70'
  },
  {
    id: 'dumbbell-reverse-fly',
    name: 'Dumbbell Reverse Fly',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'Targets the rear deltoids and upper back muscles, crucial for posture and shoulder health.',
    instructions: [
      'Hinge at your hips with a flat back, holding a dumbbell in each hand with palms facing each other.',
      'Keeping a slight bend in your elbows, raise your arms out to the sides in a wide arc, squeezing your shoulder blades together.',
      'Slowly lower the dumbbells back to the starting position with control.'
    ],
    muscleGroups: ['Upper Back', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/--4m3GcYriw',
    keywords: ['bent over raise', 'rear delt fly']
  },
  {
    id: 'dumbbell-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'The classic exercise for building the bicep muscles.',
    instructions: [
      'Stand or sit holding a dumbbell in each hand at your sides with an underhand grip (palms facing forward).',
      'Keeping your elbows pinned to your sides, curl the weights up towards your shoulders.',
      'Squeeze your biceps at the top of the movement.',
      'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
    keywords: ['arm curl']
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'A curl variation using a neutral grip to target the biceps, brachialis, and forearm muscles.',
    instructions: [
      'Stand or sit holding a dumbbell in each hand with a neutral grip (palms facing each other).',
      'Keeping your elbows at your sides, curl the dumbbells up towards your shoulders.',
      'Squeeze at the top, then slowly lower the weights back down.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4'
  },
  {
    id: 'concentration-curl',
    name: 'Concentration Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that allows for a strong peak contraction of the bicep.',
    instructions: [
      'Sit on a bench and lean forward, placing your elbow on the inside of your thigh.',
      'Hold a dumbbell with your arm fully extended.',
      'Curl the dumbbell up towards your shoulder, focusing on squeezing the bicep.',
      'Slowly lower the weight back down. Complete reps for one arm before switching.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/0AUGkch3tzc'
  },
  {
    id: 'zottman-curl',
    name: 'Zottman Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'A unique curl that combines a standard curl with a reverse curl to work both the biceps and forearms.',
    instructions: [
      'Stand holding dumbbells with an underhand grip (palms up).',
      'Curl the weights up to your shoulders like a standard bicep curl.',
      'At the top, rotate your wrists so your palms face down (overhand grip).',
      'Slowly lower the weights in this reverse position. Rotate back to palms up at the bottom.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/ZrpRBg2z9j8'
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'Performed on an incline bench, this exercise places a greater stretch on the long head of the bicep.',
    instructions: [
      'Sit back on an incline bench, holding a dumbbell in each hand with arms extended.',
      'Keeping your elbows stationary, curl the weights up towards your shoulders.',
      'Squeeze your biceps at the top.',
      'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/soz9D6-TfkI'
  },
  {
    id: 'dumbbell-tricep-kickback',
    name: 'Dumbbell Tricep Kickback',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the triceps by extending the arm against gravity.',
    instructions: [
      'Hinge at your hips with a flat back, supporting yourself with one hand on a bench.',
      'Hold a dumbbell in the other hand with your elbow bent at 90 degrees, upper arm parallel to the floor.',
      'Extend your arm straight back, squeezing your tricep.',
      'Slowly return to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/6SS6K3lAwZ8'
  },
  {
    id: 'dumbbell-overhead-tricep-extension',
    name: 'Dumbbell Overhead Tricep Extension',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'An excellent exercise for targeting all three heads of the triceps, especially the long head.',
    instructions: [
      'Sit or stand holding one dumbbell with both hands overhead.',
      'Lower the dumbbell behind your head by bending your elbows.',
      'Keep your upper arms stationary and close to your head.',
      'Extend your arms to lift the dumbbell back to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/36_I0-IviH4'
  },
  {
    id: 'dumbbell-skull-crusher',
    name: 'Dumbbell Skull Crusher',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'A triceps extension variation performed while lying down, effectively isolating the triceps.',
    instructions: [
      'Lie on a flat bench with a dumbbell in each hand, arms extended above your chest with a neutral grip.',
      'Keeping your upper arms stationary, bend your elbows to lower the dumbbells towards your head.',
      'Extend your arms to press the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/B_L0-yB43GM',
    keywords: ['lying tricep extension']
  },
  {
    id: 'dumbbell-floor-press',
    name: 'Dumbbell Floor Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A bench press variation performed on the floor, which limits the range of motion to protect the shoulders and emphasize the triceps.',
    instructions: [
      'Lie on the floor with your knees bent and feet flat. Hold a dumbbell in each hand.',
      'Start with your upper arms on the floor and elbows bent, dumbbells at your chest.',
      'Press the dumbbells straight up until your arms are fully extended.',
      'Slowly lower the weights until your upper arms touch the floor again.'
    ],
    muscleGroups: ['Chest', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/uUGDRwge4F8'
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A fundamental back exercise that builds thickness and strength in the lats and upper back.',
    instructions: [
      'Place one knee and hand on a flat bench. Hold a dumbbell in the opposite hand with your arm extended.',
      'Keeping your back flat, pull the dumbbell up towards your chest, leading with your elbow.',
      'Squeeze your back muscles at the top.',
      'Slowly lower the dumbbell back to the starting position.'
    ],
    muscleGroups: ['Lats', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8',
    keywords: ['single arm row']
  },
  {
    id: 'dumbbell-deadlift',
    name: 'Dumbbell Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A full-body exercise that strengthens the posterior chain, using dumbbells for a more accessible setup.',
    instructions: [
      'Stand with your feet hip-width apart, with a dumbbell on the outside of each foot.',
      'Hinge at your hips and bend your knees to grip the dumbbells. Keep your back straight and chest up.',
      'Drive through your heels to stand up straight, keeping the dumbbells close to your body.',
      'Reverse the motion to lower the dumbbells back to the floor with control.'
    ],
    muscleGroups: ['Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/lJ3QwaXNJfw'
  },
  {
    id: 'romanian-dumbbell-deadlift',
    name: 'Romanian Dumbbell Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'An excellent exercise for targeting the hamstrings and glutes with a focus on the hip-hinge movement.',
    instructions: [
      'Stand holding a dumbbell in each hand in front of your thighs.',
      'With a slight bend in your knees, hinge at your hips and lower the dumbbells towards the floor.',
      'Keep your back straight and the dumbbells close to your legs.',
      'Go as low as your flexibility allows, then use your hamstrings and glutes to return to the starting position.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/2_g28_mjriY',
    keywords: ['RDL']
  },
  {
    id: 'dumbbell-sumo-deadlift',
    name: 'Dumbbell Sumo Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A deadlift variation with a wide stance that targets the glutes, hamstrings, and adductors.',
    instructions: [
      'Stand with your feet wider than shoulder-width, toes pointed out.',
      'Place one dumbbell on the floor between your feet, standing it on one end.',
      'Hinge at your hips and squat down to grip the top of the dumbbell with both hands.',
      'Keeping your chest up and back straight, drive through your heels to stand up.',
      'Lower the dumbbell back to the floor with control.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Adductors'],
    videoUrl: 'https://www.youtube.com/embed/5_AMa83t9jY'
  },
  {
    id: 'dumbbell-shrug-deadlift',
    name: 'Dumbbell Shrug Deadlift',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A compound movement that combines a deadlift with a shrug to build the traps and posterior chain simultaneously.',
    instructions: [
      'Perform a dumbbell deadlift.',
      'Once you are standing fully upright at the top of the deadlift, perform a dumbbell shrug by elevating your shoulders towards your ears.',
      'Lower your shoulders, then hinge at your hips to complete the deadlift repetition.'
    ],
    muscleGroups: ['Traps', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/5_AMa83t9jY'
  },
  {
    id: 'dumbbell-front-squat',
    name: 'Dumbbell Front Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A squat variation that places more emphasis on the quadriceps and core by holding the weights in front.',
    instructions: [
      'Hold a dumbbell in each hand and rest them on your shoulders.',
      'Stand with your feet shoulder-width apart.',
      'Keeping your chest up and elbows high, perform a squat.',
      'Drive through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/Y2w6r_2b-58'
  },
  {
    id: 'dumbbell-lunge',
    name: 'Dumbbell Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'Adds resistance to the classic lunge, increasing the challenge for the quads, glutes, and hamstrings.',
    instructions: [
      'Stand holding a dumbbell in each hand at your sides.',
      'Take a large step forward with one foot.',
      'Lower your hips until both knees are bent at a 90-degree angle.',
      'Push off your front foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/D7Ka_230Vf0'
  },
  {
    id: 'dumbbell-reverse-lunge',
    name: 'Dumbbell Reverse Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A lunge variation that is often easier on the knees, with added weight to target the glutes and hamstrings.',
    instructions: [
      'Stand holding a dumbbell in each hand.',
      'Step one foot straight back, landing on the ball of your foot.',
      'Lower both knees to a 90-degree angle.',
      'Push off your back foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/jfhg_b-S-jY'
  },
  {
    id: 'dumbbell-step-up',
    name: 'Dumbbell Step-Up',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A functional exercise that builds single-leg strength, targeting the glutes and quads.',
    instructions: [
      'Stand in front of a bench or box, holding a dumbbell in each hand.',
      'Step up onto the bench with one foot, driving through your heel.',
      'Bring the other foot to meet it on top of the bench.',
      'Step back down with the same leading foot. Alternate leading legs for each set.'
    ],
    muscleGroups: ['Glutes', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/d_dt_1cntYI'
  },
  {
    id: 'dumbbell-split-squat',
    name: 'Dumbbell Split Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A stationary lunge that builds strength and stability in the lower body.',
    instructions: [
      'Stand in a staggered stance, holding a dumbbell in each hand.',
      'Lower your hips by bending both knees until your back knee nearly touches the floor.',
      'Your front knee should be at a 90-degree angle.',
      'Push through your front foot to return to the starting position. Complete reps for one side before switching.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/SjBqo-Al_ps'
  },
  {
    id: 'dumbbell-bulgarian-split-squat',
    name: 'Dumbbell Bulgarian Split Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'An advanced single-leg squat that increases the load on the front leg by elevating the rear foot.',
    instructions: [
      'Stand a few feet in front of a bench, holding dumbbells.',
      'Place the top of one foot on the bench behind you.',
      'Lower your hips until your front thigh is parallel to the ground.',
      'Keep your torso upright and push through your front heel to return to the start.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE'
  },
  {
    id: 'dumbbell-calf-raise',
    name: 'Dumbbell Calf Raise',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Isolation',
    description: 'Adds resistance to the calf raise to effectively build and strengthen the calf muscles.',
    instructions: [
      'Stand holding a dumbbell in each hand.',
      'Press through the balls of your feet to raise your heels as high as possible.',
      'Squeeze your calves at the top.',
      'Slowly lower your heels back down. Perform on a step for a greater range of motion.'
    ],
    muscleGroups: ['Calves'],
    videoUrl: 'https://www.youtube.com/embed/wxwY7GXxL4k'
  },
  {
    id: 'dumbbell-stiff-leg-deadlift',
    name: 'Dumbbell Stiff-Leg Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'Similar to an RDL but with less knee bend, placing an intense stretch and focus on the hamstrings.',
    instructions: [
      'Stand holding dumbbells in front of your thighs.',
      'Keeping your legs almost straight (a very slight bend), hinge at your hips and lower the weights towards the floor.',
      'Lower as far as your flexibility allows while keeping your back straight.',
      'Use your hamstrings and glutes to pull your torso back to the upright position.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/lA7dbI_JAXs'
  },
  {
    id: 'dumbbell-side-bend',
    name: 'Dumbbell Side Bend',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'dumbbell',
    workoutType: 'Core/Accessory',
    description: 'An isolation exercise that targets the obliques, improving lateral core strength.',
    instructions: [
      'Stand tall holding one heavy dumbbell in one hand.',
      'Slowly lower the dumbbell down the side of your leg by bending your torso sideways.',
      'Use your obliques on the opposite side to pull your torso back to the upright position.',
      'Complete reps for one side before switching.'
    ],
    muscleGroups: ['Abdominals', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/_-pW45Vwo8M'
  },
  {
    id: 'dumbbell-russian-twist',
    name: 'Dumbbell Russian Twist',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Core/Accessory',
    description: 'A core exercise that strengthens the obliques and improves rotational strength.',
    instructions: [
      'Sit on the floor with your knees bent and feet elevated. Lean back slightly.',
      'Hold one dumbbell with both hands at your chest.',
      'Rotate your torso from side to side, tapping the dumbbell on the floor next to each hip.',
      'Keep your core engaged and avoid using momentum.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/s3n_weT-d6s'
  },
  {
    id: 'dumbbell-woodchopper',
    name: 'Dumbbell Woodchopper',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Core/Accessory',
    description: 'A dynamic, full-body rotational exercise that targets the obliques and improves core power.',
    instructions: [
      'Stand with your feet shoulder-width apart, holding one dumbbell with both hands.',
      'Start by holding the dumbbell by one hip (e.g., left).',
      'Rotate your torso and lift the dumbbell diagonally across your body until it is over the opposite shoulder (e.g., right).',
      'Control the weight as you reverse the motion. Complete reps for one side before switching.'
    ],
    muscleGroups: ['Abdominals', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/5_AMa83t9jY'
  },
  {
    id: 'dumbbell-farmers-carry',
    name: 'Dumbbell Farmers Carry',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A simple yet highly effective exercise for building grip strength, core stability, and upper back strength.',
    instructions: [
      'Stand holding a heavy dumbbell in each hand at your sides.',
      'Keep your chest up, shoulders back, and core braced.',
      'Walk a set distance or for a set time, maintaining an upright posture.',
      'Avoid leaning to either side.'
    ],
    muscleGroups: ['Forearms', 'Traps', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/FkI5C2i9T5A',
    keywords: ['farmers walk']
  },
  {
    id: 'dumbbell-thruster',
    name: 'Dumbbell Thruster',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A full-body compound movement that combines a front squat with an overhead press, building power and cardiovascular endurance.',
    instructions: [
      'Hold two dumbbells at your shoulders (front rack position).',
      'Perform a front squat, going to full depth.',
      'As you drive up from the squat, use the momentum to press the dumbbells directly overhead.',
      'Lower the dumbbells back to your shoulders to begin the next rep.'
    ],
    muscleGroups: ['Shoulders', 'Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/MIVfb0x9ss4'
  },
  {
    id: 'dumbbell-clean-and-press',
    name: 'Dumbbell Clean & Press',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A powerful, full-body exercise that develops coordination and explosive strength.',
    instructions: [
      'Stand with dumbbells just outside your feet. Hinge at the hips to grab them.',
      'Explosively extend your hips and knees to "clean" the dumbbells to your shoulders.',
      'From the shoulder position, press the dumbbells overhead.',
      'Reverse the motion with control.'
    ],
    muscleGroups: ['Shoulders', 'Hamstrings', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/7rQp-Yevj3I'
  },
  {
    id: 'dumbbell-snatch',
    name: 'Dumbbell Snatch',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'dumbbell',
    workoutType: 'Compound',
    description: 'A dynamic, single-arm, full-body lift that builds explosive power from the ground up.',
    instructions: [
      'Place one dumbbell on the floor between your feet.',
      'Hinge at your hips and bend your knees to grip the dumbbell with one hand.',
      'In one fluid motion, explosively extend your hips, knees, and ankles while pulling the dumbbell straight up.',
      'As the dumbbell passes your chest, punch your hand under it to catch it overhead with a straight arm.',
      'Lower with control. Complete reps for one side before switching.'
    ],
    muscleGroups: ['Shoulders', 'Hamstrings', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/R0339-I72P0'
  },
  // --- NEW BARBELL EXERCISES ---
  {
    id: 'incline-barbell-bench-press',
    name: 'Incline Barbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'Targets the upper portion of the chest (clavicular head) to build a fuller-looking chest.',
    instructions: [
      'Set a bench to a 30-45 degree incline.',
      'Lie back and grip the barbell with hands slightly wider than shoulder-width.',
      'Unrack the bar and lower it to your upper chest.',
      'Press the bar back up to the starting position.'
    ],
    muscleGroups: ['Chest'],
    videoUrl: 'https://www.youtube.com/embed/SrqOu55lrFs',
  },
  {
    id: 'decline-barbell-bench-press',
    name: 'Decline Barbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'Targets the lower portion of the chest muscles.',
    instructions: [
      'Lie on a decline bench and secure your feet.',
      'Grip the barbell with hands slightly wider than shoulder-width.',
      'Unrack the bar and lower it to your lower chest.',
      'Press the bar back up to the starting position.'
    ],
    muscleGroups: ['Chest'],
    videoUrl: 'https://www.youtube.com/embed/LfyQBUKR8s4',
  },
  {
    id: 'close-grip-barbell-bench-press',
    name: 'Close-Grip Barbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A bench press variation with a narrower grip that places more emphasis on the triceps.',
    instructions: [
      'Lie on a flat bench and grip the barbell with your hands shoulder-width apart or slightly closer.',
      'Unrack the bar and lower it to your mid-chest, keeping your elbows tucked in.',
      'Press the bar back up, focusing on using your triceps.'
    ],
    muscleGroups: ['Chest', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/nEF0bv2FW94',
  },
  {
    id: 'barbell-floor-press',
    name: 'Barbell Floor Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A press variation that limits the range of motion, which can be easier on the shoulders and emphasizes triceps strength.',
    instructions: [
      'Lie on the floor with your knees bent.',
      'Have a partner hand you the barbell or set it up on low blocks.',
      'Grip the bar and lower it until your triceps touch the floor.',
      'Press the bar back up to full extension.'
    ],
    muscleGroups: ['Chest', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/uUGDRwge4F8',
  },
  {
    id: 'barbell-overhead-press',
    name: 'Barbell Overhead Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A fundamental upper body exercise for building shoulder strength and size.',
    instructions: [
      'Stand with the barbell in a front rack position, resting on your shoulders and clavicles.',
      'Press the bar straight overhead, moving your head slightly back to clear a path.',
      'Extend your arms fully at the top, then lower the bar with control.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
    keywords: ['military press', 'strict press']
  },
  {
    id: 'barbell-push-press',
    name: 'Barbell Push Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'An explosive overhead press variation that uses leg drive to lift heavier weight.',
    instructions: [
      'Start with the barbell in a front rack position.',
      'Dip slightly by bending your knees.',
      'Explosively extend your legs and hips to drive the barbell overhead.',
      'Lower the bar back to your shoulders with control.'
    ],
    muscleGroups: ['Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/iaBVSJm78ko',
  },
  {
    id: 'barbell-front-raise',
    name: 'Barbell Front Raise',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'An isolation exercise for the front deltoids, performed with a barbell.',
    instructions: [
      'Hold a barbell with an overhand grip, hands shoulder-width apart.',
      'Keeping your arms straight, raise the barbell in front of you up to shoulder height.',
      'Slowly lower the barbell back down with control.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/s_L128dgI70',
  },
  {
    id: 'barbell-upright-row',
    name: 'Barbell Upright Row',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A compound exercise that targets the shoulders and trapezius muscles.',
    instructions: [
      'Grip a barbell with hands closer than shoulder-width apart.',
      'Pull the bar straight up towards your chin, leading with your elbows.',
      'Keep the bar close to your body.',
      'Slowly lower the bar back to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Traps'],
    videoUrl: 'https://www.youtube.com/embed/V2y6-p9K1P8',
  },
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A mass-building exercise for the biceps using a barbell.',
    instructions: [
      'Hold a barbell with an underhand grip, hands shoulder-width apart.',
      'Keeping your elbows at your sides, curl the bar up towards your shoulders.',
      'Squeeze your biceps at the top, then slowly lower the bar.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/kwG2ZQCzK7s',
  },
  {
    id: 'barbell-reverse-curl',
    name: 'Barbell Reverse Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A curl variation with an overhand grip that targets the brachialis and forearms.',
    instructions: [
      'Hold a barbell with an overhand (pronated) grip, hands shoulder-width apart.',
      'Keeping your elbows at your sides, curl the bar up.',
      'Lower the bar slowly to emphasize the eccentric portion.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/nRgx-Zun5aA',
  },
  {
    id: 'barbell-preacher-curl',
    name: 'Barbell Preacher Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'An isolation curl performed on a preacher bench to prevent cheating and focus on the biceps.',
    instructions: [
      'Sit at a preacher curl bench, resting the back of your arms on the pad.',
      'Hold a barbell with an underhand grip.',
      'Curl the bar up, then slowly lower it until your arms are almost fully extended.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/f1186e-D_8c',
  },
  {
    id: 'barbell-close-grip-curl',
    name: 'Barbell Close-Grip Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A barbell curl with a narrow grip to emphasize the outer head of the bicep.',
    instructions: [
      'Hold a barbell with an underhand grip, hands closer than shoulder-width.',
      'Perform a bicep curl, keeping your elbows close to your body.',
      'Slowly lower the bar back down.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/kwG2ZQCzK7s',
  },
  {
    id: 'barbell-drag-curl',
    name: 'Barbell Drag Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A bicep curl variation where you "drag" the bar up your body, keeping it close and focusing on contraction.',
    instructions: [
      'Hold a barbell with a standard grip.',
      'Instead of pivoting at the elbow, pull your elbows back and drag the bar up along your torso.',
      'Focus on squeezing the biceps at the top.',
      'Lower the bar by reversing the motion.'
    ],
    muscleGroups: ['Biceps'],
    videoUrl: 'https://www.youtube.com/embed/LMd-nQ72-S0',
  },
  {
    id: 'barbell-skull-crusher',
    name: 'Barbell Skull Crusher',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A classic triceps extension exercise performed while lying on a bench.',
    instructions: [
      'Lie on a flat bench holding a barbell above your chest with a close grip.',
      'Keeping your upper arms stationary, bend your elbows to lower the bar towards your forehead.',
      'Extend your arms to press the bar back to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
  },
  {
    id: 'barbell-overhead-tricep-extension',
    name: 'Barbell Overhead Tricep Extension',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'A triceps exercise that puts a great stretch on the long head of the triceps.',
    instructions: [
      'Sit on a bench and hold a barbell with a close grip.',
      'Lift the bar overhead, then lower it behind your head by bending your elbows.',
      'Extend your arms to lift the bar back to the starting position.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/36_I0-IviH4',
  },
  {
    id: 'barbell-jm-press',
    name: 'Barbell JM Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A hybrid between a close-grip bench press and a skull crusher, great for overloading the triceps.',
    instructions: [
      'Lie on a bench as if for a close-grip press.',
      'Lower the bar in a straight line towards your upper chest/neck, letting your elbows flare slightly.',
      'Press the bar back up, focusing on the triceps.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/kdb5oQ7m64k',
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A mass-builder for the entire back, targeting the lats, rhomboids, and traps.',
    instructions: [
      'Hinge at your hips with your back straight, holding a barbell with an overhand grip.',
      'Pull the bar up towards your lower chest, squeezing your shoulder blades together.',
      'Lower the bar with control to the starting position.'
    ],
    muscleGroups: ['Lats', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/vT2GjY_Umpw',
  },
  {
    id: 'pendlay-row',
    name: 'Pendlay Row',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A strict version of the bent-over row where the bar rests on the floor between each rep, building explosive power.',
    instructions: [
      'Hinge at your hips with your back parallel to the floor.',
      'Grip the barbell and explosively pull it to your chest.',
      'Lower the bar back to the floor for a dead stop before the next rep.'
    ],
    muscleGroups: ['Lats', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/ZlRrbbjMPn0',
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'An essential hamstring and glute exercise that focuses on the hip-hinge movement.',
    instructions: [
      'Stand holding a barbell in front of your thighs.',
      'With a slight bend in your knees, hinge at your hips and lower the bar.',
      'Keep your back straight and lower the bar until you feel a deep stretch in your hamstrings.',
      'Use your hamstrings and glutes to return to the starting position.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/2_g28_mjriY',
    keywords: ['RDL']
  },
  {
    id: 'sumo-deadlift',
    name: 'Sumo Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A deadlift variation with a wide stance, targeting the glutes, hamstrings, and adductors.',
    instructions: [
      'Stand with a very wide stance, toes pointed out.',
      'Grip the barbell with your hands inside your legs.',
      'Keeping your chest up and back straight, drive through your heels to lift the bar.',
      'Lower the bar back to the floor with control.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Adductors'],
    videoUrl: 'https://www.youtube.com/embed/5_AMa83t9jY',
  },
  {
    id: 'deficit-deadlift',
    name: 'Deficit Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A deadlift performed while standing on a small platform, increasing the range of motion to build strength from the floor.',
    instructions: [
      'Stand on a low platform or weight plate.',
      'Perform a conventional deadlift, reaching lower to grip the bar.',
      'This variation is more challenging and requires good mobility.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/uep6Qpc4Hq8',
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A squat variation that emphasizes the quadriceps and core by holding the barbell in a front rack position.',
    instructions: [
      'Hold the barbell across the front of your shoulders with a clean grip or by crossing your arms.',
      'Keep your chest up and elbows high.',
      'Perform a squat, keeping your torso as upright as possible.',
      'Drive through your heels to return to the start.'
    ],
    muscleGroups: ['Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/Y2w6r_2b-58',
  },
  {
    id: 'zercher-squat',
    name: 'Zercher Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A unique and challenging squat where the barbell is held in the crook of the elbows, heavily engaging the core and upper back.',
    instructions: [
      'Set a barbell in a rack at waist height.',
      'Hold the barbell in the crook of your elbows.',
      'Lift the bar, step back, and perform a squat.',
      'Keep your back straight and core tight.'
    ],
    muscleGroups: ['Quadriceps', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/Jcui-UTI-fU',
  },
  {
    id: 'overhead-squat',
    name: 'Overhead Squat',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A total-body exercise that requires significant mobility, stability, and strength, especially in the shoulders and core.',
    instructions: [
      'Hold a barbell overhead with a wide (snatch) grip.',
      'Keep your arms locked out and the bar stable.',
      'Perform a squat, keeping your torso upright.',
      'This exercise is a great diagnostic tool for mobility.'
    ],
    muscleGroups: ['Shoulders', 'Core', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/pn8mqlG0nkE',
  },
  {
    id: 'barbell-lunge',
    name: 'Barbell Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'Adds significant load to the standard lunge, building serious single-leg strength.',
    instructions: [
      'Place a barbell across your upper back.',
      'Step forward into a lunge, lowering until both knees are at 90-degree angles.',
      'Push off the front foot to return to the start. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/D7Ka_230Vf0',
  },
  {
    id: 'barbell-reverse-lunge',
    name: 'Barbell Reverse Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A lunge variation that is often easier on the knees, with added barbell weight for increased intensity.',
    instructions: [
      'Place a barbell across your upper back.',
      'Step one foot back into a lunge, lowering until your back knee is close to the floor.',
      'Push off the back foot to return to the start. Alternate legs.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/jfhg_b-S-jY',
  },
  {
    id: 'barbell-step-up',
    name: 'Barbell Step-Up',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A functional single-leg exercise that builds glute and quad strength.',
    instructions: [
      'Place a barbell on your back.',
      'Step onto a sturdy bench or box with one foot.',
      'Drive through the heel to lift your body up.',
      'Step down with control. Complete reps for one leg before switching.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/d_dt_1cntYI',
  },
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'One of the most effective exercises for building glute size and strength.',
    instructions: [
      'Sit on the floor with your upper back against a bench.',
      'Place a padded barbell across your hips.',
      'Drive your hips up until your body is parallel to the floor, squeezing your glutes.',
      'Lower your hips back down with control.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/xDmFkJxPzeM',
  },
  {
    id: 'barbell-good-morning',
    name: 'Barbell Good Morning',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'An advanced hip-hinge exercise that heavily targets the hamstrings and lower back.',
    instructions: [
      'Place a barbell on your back as you would for a squat.',
      'With a slight bend in your knees, hinge at your hips and lower your torso until it is parallel to the floor.',
      'Keep your back straight. Use your hamstrings to pull your torso back up.'
    ],
    muscleGroups: ['Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/M-hY8O6v3oU',
  },
  {
    id: 'barbell-glute-bridge',
    name: 'Barbell Glute Bridge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A glute-building exercise performed on the floor, great for beginners or those without a bench.',
    instructions: [
      'Lie on the floor with your knees bent.',
      'Place a padded barbell across your hips.',
      'Drive your hips up, squeezing your glutes.',
      'Lower your hips back to the floor.'
    ],
    muscleGroups: ['Glutes'],
    videoUrl: 'https://www.youtube.com/embed/wPM8icPu6H8',
  },
  {
    id: 'barbell-calf-raise',
    name: 'Barbell Calf Raise',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'barbell',
    workoutType: 'Isolation',
    description: 'Uses a barbell for heavy resistance to build calf size and strength.',
    instructions: [
      'Place a barbell across your upper back.',
      'Stand with the balls of your feet on a small platform.',
      'Press through your toes to raise your heels as high as possible.',
      'Lower your heels below the platform to get a full stretch.'
    ],
    muscleGroups: ['Calves'],
    videoUrl: 'https://www.youtube.com/embed/wxwY7GXxL4k',
  },
  {
    id: 'barbell-rollout',
    name: 'Barbell Rollout',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Core/Accessory',
    description: 'An advanced core exercise similar to an ab wheel rollout, using a barbell with plates.',
    instructions: [
      'Kneel on the floor with a loaded barbell in front of you.',
      'Grip the bar and slowly roll it forward, extending your body.',
      'Go as far as you can while maintaining a flat back.',
      'Use your core to pull the bar back to the starting position.'
    ],
    muscleGroups: ['Abdominals', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/muySCTTp-eA',
  },
  {
    id: 'barbell-russian-twist',
    name: 'Barbell Russian Twist',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
    workoutType: 'Core/Accessory',
    description: 'A challenging version of the Russian twist using a barbell for resistance.',
    instructions: [
      'Sit on the floor, holding the center of a barbell.',
      'Lean back with your feet elevated.',
      'Rotate your torso to touch the end of the barbell to the floor on one side, then the other.'
    ],
    muscleGroups: ['Abdominals', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/s3n_weT-d6s',
  },
  {
    id: 'barbell-clean',
    name: 'Barbell Clean',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'An Olympic lift that develops full-body power by explosively lifting a barbell from the floor to the shoulders.',
    instructions: [
      'Start with the bar on the floor.',
      'Explosively extend your hips and knees while shrugging to pull the bar up.',
      'Drop under the bar and catch it in a front rack position.',
      'Stand up to complete the lift.'
    ],
    muscleGroups: ['Hamstrings', 'Shoulders', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/7rQp-Yevj3I',
  },
  // FIX: This exercise definition was incomplete, causing a TypeScript error.
  // It has been completed with full instructions, muscle groups, and a video URL.
  {
    id: 'barbell-clean-and-press',
    name: 'Barbell Clean & Press',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    workoutType: 'Compound',
    description: 'A compound lift that combines the clean with an overhead press for a total-body power movement.',
    instructions: [
      'Perform a barbell clean to bring the bar to your shoulders in a front rack position.',
      'From the front rack, press the barbell overhead until your arms are fully extended.',
      'Lower the bar back to your shoulders, and then lower it to the floor with control.'
    ],
    muscleGroups: ['Shoulders', 'Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/5-OKs4T_45o',
  },
];
