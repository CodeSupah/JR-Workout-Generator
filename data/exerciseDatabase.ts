import { ExerciseDetails } from '../types';

export const EXERCISE_DATABASE: ExerciseDetails[] = [
  // WARM-UP
  {
    id: 'arm-circles',
    name: 'Arm Circles (Forward & Backward)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A simple dynamic stretch to warm up the shoulder joints and surrounding muscles.',
    instructions: [
      'Stand with your feet shoulder-width apart, arms extended to your sides at shoulder height.',
      'Slowly rotate your arms forward in small circles.',
      'Gradually increase the size of the circles.',
      'After about 15-20 seconds, reverse the direction and make backward circles.'
    ],
    muscleGroups: ['Shoulders', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/1hp3-mFN2eA',
    keywords: ['shoulder circles']
  },
  {
    id: 'torso-twists',
    name: 'Torso Twists',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A dynamic stretch that warms up the core and improves rotational mobility in the spine.',
    instructions: [
      'Stand with feet shoulder-width apart and knees slightly bent.',
      'Hold your arms out in front of you or cross them over your chest.',
      'Rotate your torso from side to side in a controlled manner.',
      'Allow your hips and feet to pivot naturally with the movement.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/s_eB6K3aM9E',
    keywords: ['standing twists']
  },
  {
    id: 'leg-swings',
    name: 'Leg Swings (Forward & Side)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A dynamic stretch that opens up the hips and warms up the hamstrings, glutes, and hip flexors.',
    instructions: [
      'Hold onto a wall or sturdy object for balance.',
      'Swing one leg forward and backward in a controlled, fluid motion.',
      'After 10-15 swings, switch to swinging the same leg side-to-side in front of your body.',
      'Repeat the entire sequence with the other leg.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/daH-F3I2z18',
    keywords: ['dynamic leg stretch']
  },
  {
    id: 'bodyweight-butt-kicks',
    name: 'Butt Kicks (Warm-up)',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A dynamic warm-up exercise that actively stretches the quadriceps and warms up the hamstrings.',
    instructions: [
      'Stand in place or jog lightly.',
      'Alternate kicking your heels up towards your glutes.',
      'Keep your upper body upright and knees pointed towards the ground.',
      'Maintain a quick, steady rhythm.'
    ],
    muscleGroups: ['Hamstrings', 'Quadriceps', 'Glutes'],
    videoUrl: 'https://www.youtube.com/embed/g-i_m8Lg-e4'
  },
  {
    id: 'light-jog',
    name: 'Light Jog in Place',
    category: 'Flexibility & Mobility',
    purpose: 'warmup',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A simple way to elevate your heart rate and increase blood flow to the muscles before a workout.',
    instructions: [
      'Stand with your feet hip-width apart.',
      'Begin jogging lightly in place, landing softly on the balls of your feet.',
      'Keep your arms bent and swing them gently to the rhythm.',
      'Maintain a comfortable, conversational pace.'
    ],
    muscleGroups: ['Calves', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/Ro0pW2_vA3I'
  },

  // JUMP ROPE
  {
    id: 'basic-bounce',
    name: 'Basic Bounce',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    description: 'The fundamental jump rope movement, perfect for warming up and building a foundation.',
    instructions: [
      'Hold the handles with a relaxed grip, elbows close to your body.',
      'Swing the rope over your head using your wrists, not your shoulders.',
      'Jump just high enough to clear the rope, about 1-2 inches off the ground.',
      'Land softly on the balls of your feet.'
    ],
    muscleGroups: ['Calves', 'Quadriceps', 'Glutes', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/g8_j1gH4l_M',
    keywords: ['regular bounce', 'two-foot bounce']
  },
  {
    id: 'boxer-step',
    name: 'Boxer Step',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'rope',
    description: 'A low-impact alternative to the basic bounce, great for longer sessions.',
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
    id: 'high-knees',
    name: 'High Knees',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'Increases cardiovascular intensity and engages the core more than a basic jump.',
    instructions: [
      'While jumping, alternate lifting each knee up towards your chest.',
      'Aim to bring your thigh parallel to the ground.',
      'Maintain a steady rhythm and keep your core tight.'
    ],
    muscleGroups: ['Abdominals', 'Quadriceps', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/jK51k2v7vjY'
  },
  {
    id: 'criss-cross',
    name: 'Criss-Cross',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'A classic freestyle trick that improves coordination and timing.',
    instructions: [
      'Perform a basic bounce to get your rhythm.',
      'On one jump, cross your arms in front of your body.',
      'Jump through the loop created by the crossed rope.',
      'Immediately uncross your arms on the next jump.'
    ],
    muscleGroups: ['Shoulders', 'Calves'],
    keywords: ['crossover', 'cross-over']
  },
  {
    id: 'double-under',
    name: 'Double Under',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'rope',
    description: 'An explosive movement where the rope passes under your feet twice for every single jump.',
    instructions: [
      'Jump higher than you would for a basic bounce.',
      'Use a powerful flick of the wrists to increase rope speed.',
      'Keep your core tight and body in a straight line.',
      'Tuck your knees slightly to give the rope more room to pass.'
    ],
    muscleGroups: ['Calves', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/82j00w4kv5Y',
    keywords: ['dubs']
  },
  {
    id: 'side-swing',
    name: 'Side Swing',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'A freestyle move where the rope is swung to the side of the body instead of overhead, great for transitions and rhythm.',
    instructions: [
      'Start with a basic bounce.',
      'Bring both hands together on one side of your body (e.g., your right hip).',
      'Swing the rope in a loop on that side, tapping it on the ground.',
      'You can perform a small "ghost" jump without the rope passing under you.',
      'Swing the rope back overhead to return to basic jumps or swing to the other side.'
    ],
    muscleGroups: ['Shoulders', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/fW098G2b_ps',
    keywords: ['side-whip']
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'A dynamic jump rope variation that increases intensity and targets the hamstrings.',
    instructions: [
      'While jumping, alternate kicking your heels back towards your glutes.',
      'Keep your knees pointed towards the ground.',
      'Maintain a quick and consistent rhythm with the rope.'
    ],
    muscleGroups: ['Hamstrings', 'Quadriceps', 'Glutes', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/dGIOv_mS-A8'
  },
  {
    id: 'side-straddle',
    name: 'Side Straddle (Jumping Jacks)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'Combines the classic jumping jack motion with jumping rope, enhancing coordination and working different leg muscles.',
    instructions: [
      'Start with a basic bounce with feet together.',
      'On the next jump, land with your feet wide apart (straddle position).',
      'On the following jump, bring your feet back together.',
      'Continue alternating between feet together and feet apart with each rope turn.'
    ],
    muscleGroups: ['Adductors', 'Abductors', 'Calves', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/5Y_15oHiGxc',
    keywords: ['jumping jack jump']
  },
  {
    id: 'forward-straddle',
    name: 'Forward Straddle (Scissors)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'A jump rope variation that involves alternating your feet forward and backward, similar to a scissor motion.',
    instructions: [
      'Begin with a basic bounce.',
      'On the next jump, land with one foot forward and one foot back.',
      'On the following jump, switch the position of your feet.',
      'Keep your upper body stable and core engaged.'
    ],
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/p3uS33tqNoc',
    keywords: ['scissors', 'scissor jumps']
  },
  {
    id: 'twist-jumps',
    name: 'Twist Jumps (Skiers)',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'This move involves twisting the lower body from side to side, engaging the obliques and improving core stability.',
    instructions: [
      'Start with a basic bounce, keeping your feet together.',
      'On each jump, twist your hips to one side, landing with your feet pointing slightly left or right.',
      'On the next jump, twist to the opposite side.',
      'Keep your shoulders and upper body facing forward as much as possible.'
    ],
    muscleGroups: ['Abdominals', 'Calves', 'Quadriceps'],
    videoUrl: 'https://www.youtube.com/embed/p17k7sW8s8k',
    keywords: ['ski jumps', 'slalom jumps']
  },
  {
    id: 'weighted-rope-basic-bounce',
    name: 'Weighted Rope Basic Bounce',
    category: 'Jump Rope',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'weighted-rope',
    description: 'Performing the basic bounce with a weighted rope significantly increases the resistance, building upper body strength and power.',
    instructions: [
      'Use a weighted rope (0.5 lb or heavier).',
      'Focus on using your wrists to turn the heavier rope.',
      'Maintain the same form as a regular basic bounce: small jumps, relaxed shoulders.',
      'Expect a slower pace and higher intensity than with a speed rope.'
    ],
    muscleGroups: ['Shoulders', 'Forearms', 'Abdominals', 'Calves', 'Upper Back'],
    videoUrl: 'https://www.youtube.com/embed/CXm_eC42lVg',
    keywords: ['heavy rope']
  },

  // CARDIO
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'Cardio',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    name: 'Incline Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    id: 'knee-push-up',
    name: 'Knee Push-up',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
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
    difficulty: 'Advanced',
    equipment: 'bodyweight',
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
    id: 'banded-bicep-curl',
    name: 'Banded Bicep Curl',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
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
    id: 'banded-tricep-extension',
    name: 'Banded Tricep Extension',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
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
    id: 'banded-chest-press',
    name: 'Banded Chest Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
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
    id: 'banded-row',
    name: 'Banded Row',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
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
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
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
    id: 'banded-overhead-press',
    name: 'Banded Overhead Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
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
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Upper Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'barbell',
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
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    description: 'A squat variation that emphasizes core stability and an upright torso.',
    instructions: [
      'Hold one dumbbell vertically against your chest with both hands.',
      'Stand with feet slightly wider than shoulder-width.',
      'Perform a squat, keeping the dumbbell close to your body and your back straight.',
      'Drive through your heels to stand back up.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/MeW_P-avd48'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
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
    id: 'banded-squat',
    name: 'Banded Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
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
    id: 'banded-glute-bridge',
    name: 'Banded Glute Bridge',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'resistance-band',
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
    id: 'banded-lateral-walk',
    name: 'Banded Lateral Walk',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
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
    id: 'barbell-squat',
    name: 'Barbell Squat',
    category: 'Lower Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'barbell',
    description: 'A core strength exercise that involves squatting with a barbell resting on the upper back, building powerful legs and a strong core.',
    instructions: [
      'Position a barbell on a squat rack at shoulder height.',
      'Step under the bar and rest it across your upper back. Grip the bar with hands wider than your shoulders.',
      'Lift the bar off the rack and step back. Stand with feet shoulder-width apart.',
      'Lower your hips back and down, keeping your chest up and back straight.',
      'Push through your heels to return to the starting position.'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8'
  },


  // CORE
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    id: 'pallof-press',
    name: 'Pallof Press',
    category: 'Core',
    purpose: 'main',
    difficulty: 'Intermediate',
    equipment: 'resistance-band',
    description: 'An anti-rotation core exercise that builds stability by resisting a rotational force.',
    instructions: [
      'Anchor a band at chest height.',
      'Stand sideways to the anchor and hold the band with both hands at your chest.',
      'Step away from the anchor to create tension.',
      'Press the band straight out in front of you, resisting the urge to twist. Hold, then return to your chest.'
    ],
    muscleGroups: ['Abdominals'],
    videoUrl: 'https://www.youtube.com/embed/6u_0kY-kYJU'
  },

  // FULL BODY
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'Full Body',
    purpose: 'main',
    difficulty: 'Advanced',
    equipment: 'kettlebell',
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
    difficulty: 'Advanced',
    equipment: 'barbell',
    description: 'A compound lift that builds total-body strength by lifting a loaded barbell off the floor.',
    instructions: [
      'Stand with your mid-foot under the barbell.',
      'Hinge at your hips and bend your knees to grip the bar with hands just outside your legs.',
      'Keep your back straight, chest up, and look forward.',
      'Drive through your heels to lift the weight, keeping the bar close to your body.',
      'Stand up tall, then reverse the motion to lower the bar with control.'
    ],
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Upper Back', 'Lats', 'Traps', 'Forearms'],
    videoUrl: 'https://www.youtube.com/embed/VL5Ab0T07e4'
  },


  // COOL-DOWN
  {
    id: 'quad-stretch',
    name: 'Quad Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    keywords: ['quadriceps stretch', 'standing quad stretch']
  },
  {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A static stretch to increase flexibility in the hamstrings, located at the back of the thigh.',
    instructions: [
      'Sit on the floor with one leg extended straight out.',
      'Bend the other leg, placing the sole of your foot against your inner thigh.',
      'Hinge at your hips and gently lean forward over the straight leg.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Hamstrings', 'Lower Back'],
    videoUrl: 'https://www.youtube.com/embed/PHYB2a1lA_I',
    keywords: ['seated hamstring stretch']
  },
  {
    id: 'calf-stretch',
    name: 'Calf Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
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
    id: 'chest-stretch',
    name: 'Chest Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'Opens up the chest muscles and improves posture, especially after push-ups or other pressing movements.',
    instructions: [
      'Stand in a doorway or at a corner of a wall.',
      'Place your forearm on the wall with your elbow bent at a 90-degree angle.',
      'Gently step forward and rotate your body away from your arm until you feel a stretch in your chest and shoulder.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Chest', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/NSi8_22dG9E',
    keywords: ['doorway stretch']
  },
  {
    id: 'triceps-stretch',
    name: 'Triceps Stretch',
    category: 'Flexibility & Mobility',
    purpose: 'cooldown',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A static stretch to relieve tension in the triceps muscle at the back of the upper arm.',
    instructions: [
      'Raise one arm straight overhead.',
      'Bend your elbow and let your hand fall behind your head.',
      'Use your other hand to gently pull the elbow towards the midline of your body.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    muscleGroups: ['Triceps', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/3n_rB5GIOe0',
    keywords: ['overhead tricep stretch']
  }
];