import { ExerciseDetails, WorkoutGoal } from '../types';

export const EXERCISE_DATABASE: ExerciseDetails[] = [
  // WARM-UP
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Cardio],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Core],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Core],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Core, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Cardio],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Core, WorkoutGoal.FullBody],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'A simple variation that involves hopping side-to-side, improving lateral quickness and engaging different parts of the lower leg muscles.',
    instructions: [
      'Start with a basic two-foot bounce.',
      'On each jump, hop a few inches to one side.',
      'On the next jump, hop back to the center or to the opposite side.',
      'Keep your feet together and maintain a steady rhythm.'
    ],
    muscleGroups: ['Calves', 'Abductors', 'Adductors', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['side hops']
  },
  {
    id: 'forward-backward-jump',
    name: 'Forward-Backward Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Core],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'This move involves jumping side to side with feet together, engaging the obliques and improving lateral quickness.',
    instructions: [
      'Start with a basic bounce, keeping your feet together.',
      'On each jump, hop a few inches to one side.',
      'On the next jump, hop to the opposite side.',
      'Keep your feet and knees together as you move side to side, like a slalom skier.'
    ],
    muscleGroups: ['Calves', 'Obliques', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['ski jumps', 'slalom jumps']
  },
  {
    id: 'bell-jump',
    name: 'Bell Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Core],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment', 'bodyweight'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody, WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength],
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
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio],
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
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'Engages the core and glutes by twisting the hips from side to side with each jump.',
    instructions: [
      'Begin with a basic two-foot bounce with feet together.',
      'On each jump, twist your hips and lower body to one side while keeping your upper body facing forward.',
      'On the next jump, twist to the opposite side.',
      'Focus on a sharp, controlled rotation from the core.'
    ],
    muscleGroups: ['Glutes', 'Obliques', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['hip twists']
  },
  {
    id: 'criss-cross',
    name: 'Criss-Cross (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'A variation of the side swing where the rope is swung twice on one side before transitioning, enhancing rhythm and core engagement.',
    instructions: [
      'Swing the rope to one side of your body for two full rotations.',
      'Perform two small "ghost" jumps (without the rope going under) to keep time.',
      'After the second swing, open your arms and jump through the rope.',
      'You can then perform a basic jump or transition to a double side swing on the other side.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/fW098G2b_ps',
    keywords: ['double side whip']
  },
  {
    id: 'side-swing',
    name: 'Side Swing (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'A freestyle move where the rope is swung to the side of the body, great for transitions and active recovery.',
    instructions: [
      'Start with a basic bounce.',
      'Bring both hands together on one side of your body (e.g., your right hip).',
      'Swing the rope in a loop on that side, tapping it on the ground.',
      'You can perform a small "ghost" jump to keep rhythm.',
      'Swing the rope back overhead to return to basic jumps or swing to the other side.'
    ],
    muscleGroups: ['Abdominals', 'Shoulders', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/fW098G2b_ps',
    keywords: ['side-whip']
  },
  {
    id: '360-spin-jump',
    name: '360 Spin Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio, WorkoutGoal.Core],
    workoutType: 'Cardio/HIIT',
    description: 'An advanced trick that involves performing a full 360-degree body turn while jumping over the rope.',
    instructions: [
      'Establish a steady basic jump rhythm.',
      'Perform a slightly higher jump than usual.',
      'As you jump, initiate a spin with your head and shoulders.',
      'Keep the rope turning at a consistent speed and complete the full rotation to land facing forward.',
    ],
    muscleGroups: ['Abdominals', 'Calves', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/01pgSePS54U',
    keywords: ['full turn']
  },
  {
    id: 'backward-jump',
    name: 'Backward Jump (JR)',
    category: 'Jump Rope',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.FullBody, WorkoutGoal.Cardio],
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
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody, WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Mobility],
    workoutType: 'Isolation',
    description: 'A great exercise for improving posture and strengthening the muscles of the upper back and rear shoulders.',
    instructions: [
      'Lie face down on the floor with your arms extended by your sides, palms down.', 
      'Lift your chest and arms slightly off the floor.', 
      'Keeping your arms straight, slowly sweep them in a wide arc until they are overhead.', 
      'Slowly reverse the motion back to the starting position.'
    ],
    muscleGroups: ['Upper Back', 'Shoulders', 'Traps'],
    videoUrl: 'https://www.youtube.com/embed/a79_g_b06I0'
  },
  {
    id: 'inverted-rows',
    name: 'Inverted Rows',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    videoUrl: 'https://www.youtube.com/embed/p-85PGCe34c'
  },
  {
    id: 'archer-rows',
    name: 'Archer Rows',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core, WorkoutGoal.FullBody],
    workoutType: 'Compound',
    description: 'A dynamic exercise that builds the strength and confidence needed for handstands and handstand push-ups.',
    instructions: [
      'Start in a push-up position with your feet against a wall.', 
      'Begin to walk your feet up the wall while simultaneously walking your hands closer to the wall.', 
      'Walk as high as you comfortably can, aiming for a vertical handstand position.', 
      'Slowly walk your hands and feet back down to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/C2oWkX9aJ6E'
  },
  {
    id: 'handstand-push-ups',
    name: 'Handstand Push-Ups',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody, WorkoutGoal.Core],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
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
    skillLevels: ['Advanced'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Intermediate'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
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
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
    workoutType: 'Compound',
    description: 'A lunge variation that is often easier on the knees and places more emphasis on the glutes.',
    instructions: [
      'Stand tall with your feet hip-width apart.',
      'Step one foot straight back, landing on the ball of your foot.',
      'Lower your hips until both knees are bent at approximately a 90-degree angle.',
      'Your front knee should be above your ankle, and your back knee should hover just off the ground.',
      'Push off your back foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/7pw-S-Y_T-k'
  },
  {
    id: 'db-bench-press',
    name: 'Dumbbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Compound',
    description: 'A fundamental upper-body exercise that builds chest, shoulder, and triceps strength, allowing for a greater range of motion than a barbell.',
    instructions: [
      'Lie on a flat bench with a dumbbell in each hand, resting on your thighs.',
      'Kick the dumbbells up to your chest and press them to the starting position with arms extended.',
      'Lower the dumbbells in a controlled manner until they are level with your chest.',
      'Press the dumbbells back up to the starting position, squeezing your chest.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94'
  },
  {
    id: 'db-rows',
    name: 'Dumbbell Rows',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Compound',
    description: 'A key exercise for building a strong and thick back, targeting the lats, rhomboids, and biceps.',
    instructions: [
      'Place one knee and hand on a flat bench, keeping your back parallel to the floor.',
      'Hold a dumbbell in the opposite hand with your arm extended.',
      'Pull the dumbbell up towards your hip, squeezing your back muscles.',
      'Keep your elbow close to your body.',
      'Lower the dumbbell with control. Complete reps on one side before switching.'
    ],
    muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8',
    keywords: ['single arm row']
  },
  {
    id: 'db-goblet-squat',
    name: 'Goblet Squat (Dumbbell)',
    category: 'Lower Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody, WorkoutGoal.Core],
    workoutType: 'Compound',
    description: 'A fantastic squat variation that promotes good form and strengthens the entire lower body and core.',
    instructions: [
      'Stand with your feet slightly wider than shoulder-width apart.',
      'Hold one dumbbell vertically against your chest with both hands.',
      'Keeping your chest up and back straight, lower into a deep squat.',
      'Go as low as you can while maintaining good posture.',
      'Push through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/MeW_P-2_3rY'
  },
  {
    id: 'db-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Compound',
    description: 'A primary exercise for building shoulder strength and size, targeting all three heads of the deltoid.',
    instructions: [
      'Sit on a bench with back support, holding a dumbbell in each hand at shoulder height, palms facing forward.',
      'Press the dumbbells straight overhead until your arms are fully extended.',
      'Avoid locking out your elbows at the top.',
      'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5-j_I'
  },
  {
    id: 'db-lunges',
    name: 'Dumbbell Lunges',
    category: 'Lower Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
    workoutType: 'Compound',
    description: 'Adds resistance to the standard lunge, increasing the challenge for your quads, glutes, and hamstrings while also improving balance.',
    instructions: [
      'Stand tall, holding a dumbbell in each hand at your sides.',
      'Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.',
      'Ensure your front knee does not travel past your toes.',
      'Push off the front foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/D7Ka_m7nQxU'
  },
  {
    id: 'db-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift',
    category: 'Lower Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody],
    workoutType: 'Compound',
    description: 'An essential hamstring and glute exercise that focuses on the hip-hinge movement pattern.',
    instructions: [
        'Stand with feet hip-width apart, holding a dumbbell in each hand in front of your thighs.',
        'Keeping your back straight and legs almost straight (slight knee bend), hinge at your hips and lower the dumbbells towards the floor.',
        'Lower as far as your hamstring flexibility allows without rounding your back.',
        'Squeeze your glutes to drive your hips forward and return to the starting position.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/2_g28_Mcy3M'
  },
  {
    id: 'db-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Beginner'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Isolation',
    description: 'The classic isolation exercise for building the bicep muscles.',
    instructions: [
        'Stand or sit, holding a dumbbell in each hand with an underhand grip, arms by your sides.',
        'Keeping your elbows pinned to your sides, curl the dumbbells up towards your shoulders.',
        'Squeeze your biceps at the top of the movement.',
        'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Biceps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo'
  },
  {
    id: 'db-overhead-tricep-extension',
    name: 'Dumbbell Overhead Tricep Extension',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Isolation',
    description: 'An effective exercise for isolating and building all three heads of the triceps.',
    instructions: [
        'Sit or stand, holding one dumbbell with both hands over your head.',
        'Keeping your elbows close to your head, lower the dumbbell behind your head by bending your elbows.',
        'Extend your arms to lift the dumbbell back to the starting position, focusing on the tricep contraction.'
    ],
    muscleGroups: ['Triceps'],
    videoUrl: 'https://www.youtube.com/embed/36b_g0I64A0'
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Beginner'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Isolation',
    description: 'An isolation exercise that targets the medial (side) deltoid, crucial for building shoulder width.',
    instructions: [
        'Stand with a light dumbbell in each hand at your sides.',
        'With a slight bend in your elbows, raise your arms out to your sides until they are parallel with the floor.',
        'Avoid using momentum. Control the weight on the way up and down.',
        'Slowly lower the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo'
  },
  {
    id: 'db-chest-fly',
    name: 'Dumbbell Chest Fly',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['dumbbell'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Isolation',
    description: 'An isolation exercise that stretches and contracts the pectoral muscles, ideal for chest development.',
    instructions: [
        'Lie on a flat bench with a dumbbell in each hand, arms extended above your chest with palms facing each other.',
        'With a slight bend in your elbows, lower the dumbbells out to your sides in a wide arc.',
        'Lower until you feel a stretch in your chest.',
        'Squeeze your chest muscles to bring the dumbbells back to the starting position.'
    ],
    muscleGroups: ['Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/eozb-v_K_L8'
  },
  {
    id: 'kb-swing',
    name: 'Kettlebell Swings',
    category: 'Full Body',
    purpose: 'main',
    skillLevels: ['Intermediate', 'Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody],
    workoutType: 'Cardio/HIIT',
    description: 'A powerful, explosive exercise that develops posterior chain strength, cardiovascular endurance, and total-body power.',
    instructions: [
      'Stand with feet shoulder-width apart, holding the kettlebell with both hands.',
      'Hinge at your hips, sending the kettlebell back between your legs.',
      'Explosively drive your hips forward to propel the kettlebell up to chest height.',
      'The movement is a hip hinge, not a squat. Your arms guide the bell, but the power comes from your hips.',
      'Let the kettlebell swing back down naturally and repeat.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Lower Back', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/sSESeQoM_8c'
  },
  {
    id: 'kb-goblet-squat',
    name: 'Goblet Squat (Kettlebell)',
    category: 'Lower Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody, WorkoutGoal.Core],
    workoutType: 'Compound',
    description: 'An excellent squat variation that builds lower body strength while reinforcing an upright posture.',
    instructions: [
      'Hold the kettlebell by the horns close to your chest.',
      'Stand with your feet slightly wider than shoulder-width apart.',
      'Keeping your chest up, lower into a deep squat.',
      'Drive through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/PKmrG6f_5nE'
  },
  {
    id: 'kb-clean-press',
    name: 'Kettlebell Clean and Press',
    category: 'Full Body',
    purpose: 'main',
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody, WorkoutGoal.Cardio],
    workoutType: 'Compound',
    description: 'A full-body power exercise that combines a clean to the rack position with an overhead press, building strength and coordination.',
    instructions: [
      'Start with the kettlebell on the floor between your feet.',
      'Hinge at your hips and grip the handle. Explosively extend your hips to "clean" the kettlebell to the shoulder rack position.',
      'From the rack position, press the kettlebell straight overhead.',
      'Lower the kettlebell back to the rack position, then back to the floor with control.'
    ],
    muscleGroups: ['Shoulders', 'Glutes', 'Hamstrings', 'Triceps', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/jclE6MKKI9E'
  },
  {
    id: 'turkish-get-up',
    name: 'Turkish Get-Up',
    category: 'Full Body',
    purpose: 'main',
    skillLevels: ['Advanced'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody, WorkoutGoal.Mobility, WorkoutGoal.Core],
    workoutType: 'Compound',
    description: 'A slow, deliberate, full-body movement that builds total-body stability, mobility, and strength.',
    instructions: [
      'Lie on your back, press the kettlebell up with one arm.',
      'Follow a specific sequence of movements: roll to your elbow, then to your hand, lift your hips, sweep your leg through, and stand up.',
      'Reverse the sequence to lie back down, all while keeping the kettlebell stable overhead.',
      'This exercise is complex; it is highly recommended to learn the steps without weight first.'
    ],
    muscleGroups: ['Shoulders', 'Abdominals', 'Glutes', 'Quadriceps', 'Triceps'],
    videoUrl: 'https://www.youtube.com/embed/0bWRPC49-KI'
  },
  {
    id: 'kb-single-arm-row',
    name: 'Kettlebell Single Arm Row',
    category: 'Upper Body',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength],
    workoutType: 'Compound',
    description: 'A unilateral back exercise that builds strength and helps correct muscular imbalances.',
    instructions: [
        'Place the kettlebell on the floor next to your foot. Hinge at your hips, keeping your back straight.',
        'Support yourself with one hand on a bench or your knee.',
        'Grab the kettlebell with the other hand and pull it up towards your hip, keeping your elbow tight to your body.',
        'Squeeze your lat and upper back muscles at the top.',
        'Lower the kettlebell with control.'
    ],
    muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
    videoUrl: 'https://www.youtube.com/embed/IOEL3x_ZJgw'
  },
  {
    id: 'kb-halo',
    name: 'Kettlebell Halo',
    category: 'Full Body',
    purpose: 'main',
    skillLevels: ['Beginner', 'Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Mobility, WorkoutGoal.Core],
    workoutType: 'Mobility/Stretch',
    description: 'An excellent mobility exercise for the shoulders, thoracic spine, and core.',
    instructions: [
        'Kneel or stand, holding the kettlebell by the horns upside down at your chest.',
        'Circle the kettlebell around your head in one direction, keeping it as close to your neck and shoulders as possible.',
        'Keep your core tight and avoid tilting your head or arching your back.',
        'Complete reps in one direction, then switch.'
    ],
    muscleGroups: ['Shoulders', 'Upper Back', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/sWfYPjTz-2I'
  },
  {
    id: 'kb-russian-twist',
    name: 'Kettlebell Russian Twist',
    category: 'Core',
    purpose: 'main',
    skillLevels: ['Intermediate'],
    equipment: ['gym-equipment'],
    goals: [WorkoutGoal.Strength, WorkoutGoal.Core],
    workoutType: 'Core/Accessory',
    description: 'A core exercise that targets the obliques and improves rotational strength.',
    instructions: [
        'Sit on the floor with your knees bent and feet slightly elevated.',
        'Lean back slightly to engage your core, holding the kettlebell with both hands at your chest.',
        'Twist your torso from side to side, tapping the kettlebell on the floor next to your hip on each side.',
        'Keep your hips stable and rotate from your upper body.'
    ],
    muscleGroups: ['Abdominals', 'Obliques'],
    videoUrl: 'https://www.youtube.com/embed/NeAtimSCxsY'
  }
];