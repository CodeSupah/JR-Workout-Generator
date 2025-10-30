import { ExerciseDetails } from '../types';

export const EXERCISE_DATABASE: ExerciseDetails[] = [
  // JUMP ROPE
  {
    id: 'basic-bounce',
    name: 'Basic Bounce',
    category: 'Jump Rope',
    difficulty: 'Beginner',
    equipment: 'rope',
    description: 'The fundamental jump rope movement, perfect for warming up and building a foundation.',
    instructions: [
      'Hold the handles with a relaxed grip, elbows close to your body.',
      'Swing the rope over your head using your wrists, not your shoulders.',
      'Jump just high enough to clear the rope, about 1-2 inches off the ground.',
      'Land softly on the balls of your feet.'
    ],
    muscleGroups: ['Calves', 'Quads', 'Glutes', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/g8_j1gH4l_M',
    keywords: ['regular bounce', 'two-foot bounce']
  },
  {
    id: 'boxer-step',
    name: 'Boxer Step',
    category: 'Jump Rope',
    difficulty: 'Beginner',
    equipment: 'rope',
    description: 'A low-impact alternative to the basic bounce, great for longer sessions.',
    instructions: [
      'Start with a basic bounce rhythm.',
      'Shift your weight from one foot to the other with each jump, tapping the non-jumping foot lightly.',
      'Keep your knees slightly bent and stay on the balls of your feet.'
    ],
    muscleGroups: ['Calves', 'Quads', 'Core', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/M8A-sxkC8-k',
    keywords: ['boxer shuffle']
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'Jump Rope',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'Increases cardiovascular intensity and engages the core more than a basic jump.',
    instructions: [
      'While jumping, alternate lifting each knee up towards your chest.',
      'Aim to bring your thigh parallel to the ground.',
      'Maintain a steady rhythm and keep your core tight.'
    ],
    muscleGroups: ['Core', 'Hip Flexors', 'Quads', 'Calves'],
    videoUrl: 'https://www.youtube.com/embed/jK51k2v7vjY'
  },
  {
    id: 'criss-cross',
    name: 'Criss-Cross',
    category: 'Jump Rope',
    difficulty: 'Intermediate',
    equipment: 'rope',
    description: 'A classic freestyle trick that improves coordination and timing.',
    instructions: [
      'Perform a basic bounce to get your rhythm.',
      'On one jump, cross your arms in front of your body.',
      'Jump through the loop created by the crossed rope.',
      'Immediately uncross your arms on the next jump.'
    ],
    muscleGroups: ['Shoulders', 'Coordination', 'Calves'],
    keywords: ['crossover', 'cross-over']
  },
  {
    id: 'double-under',
    name: 'Double Under',
    category: 'Jump Rope',
    difficulty: 'Advanced',
    equipment: 'rope',
    description: 'An explosive movement where the rope passes under your feet twice for every single jump.',
    instructions: [
      'Jump higher than you would for a basic bounce.',
      'Use a powerful flick of the wrists to increase rope speed.',
      'Keep your core tight and body in a straight line.',
      'Tuck your knees slightly to give the rope more room to pass.'
    ],
    muscleGroups: ['Calves', 'Power', 'Coordination', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/82j00w4kv5Y',
    keywords: ['dubs']
  },

  // CARDIO
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A classic full-body cardio exercise that elevates the heart rate and is great for warming up.',
    instructions: [
      'Start standing with your feet together and arms at your sides.',
      'Simultaneously jump your feet out to the sides while raising your arms overhead.',
      'Immediately jump back to the starting position.',
      'Repeat in a continuous rhythm.'
    ],
    muscleGroups: ['Full Body', 'Calves', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA',
    keywords: ['star jumps']
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    description: 'A full-body, high-intensity exercise that builds strength and cardiovascular endurance.',
    instructions: [
      'Start standing, then drop into a squat position with your hands on the floor.',
      'Kick your feet back into a plank position.',
      'Immediately return your feet to the squat position.',
      'Jump up explosively from the squat position.'
    ],
    muscleGroups: ['Full Body', 'Quads', 'Chest', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
    keywords: ['squat thrust']
  },
  
  // UPPER BODY
  {
    id: 'incline-push-up',
    name: 'Incline Push-up',
    category: 'Upper Body',
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
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    description: 'A classic upper body exercise that builds chest, shoulder, and triceps strength.',
    instructions: [
      'Start in a plank position with hands slightly wider than your shoulders.',
      'Lower your body until your chest nearly touches the floor, keeping your back straight.',
      'Push yourself back up to the starting position.',
      'For an easier variation, perform on your knees.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    keywords: ['press-up']
  },
  {
    id: 'triceps-dip',
    name: 'Triceps Dip',
    category: 'Upper Body',
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
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    description: 'An advanced push-up variation that shifts the focus to the shoulders by performing the movement in a pike position.',
    instructions: [
      'Start in a downward dog yoga pose, with your hips high and body in an inverted "V" shape.', 
      'Bend your elbows to lower the top of your head towards the floor.', 
      'Keep your legs straight and hips high.', 
      'Push back up to the starting position.'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Chest'],
    videoUrl: 'https://www.youtube.com/embed/6_H-1_rT-Uo'
  },
  {
    id: 'archer-push-up',
    name: 'Archer Push-up',
    category: 'Upper Body',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    description: 'An advanced unilateral push-up that builds strength for the one-arm push-up by shifting weight to one side while the other arm provides support.',
    instructions: [
      'Start in a wide push-up position.', 
      'Lower your body towards one hand, keeping that elbow tucked in.', 
      'The opposite arm will straighten out to the side for support, like an archer drawing a bow.', 
      'Push back up to the center and repeat on the other side.'
    ],
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/6FB3Bv_iiG0'
  },

  // LOWER BODY
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'Lower Body',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A fundamental lower body movement that strengthens legs and glutes.',
    instructions: [
      'Stand with your feet shoulder-width apart.',
      'Lower your hips back and down as if sitting in a chair.',
      'Keep your chest up and back straight.',
      'Go as low as you can comfortably, then push through your heels to return to the start.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/C_VtOYc6j5c',
    keywords: ['air squat']
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'Lower Body',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A lunge variation that is often easier on the knees and helps improve balance and single-leg strength.',
    instructions: [
      'Stand with your feet together.', 
      'Step one foot straight back, landing on the ball of your foot.', 
      'Lower both knees to a 90-degree angle, keeping your front knee aligned over your ankle.', 
      'Push off your back foot to return to the starting position. Alternate legs.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
    videoUrl: 'https://www.youtube.com/embed/oYiBDWhmrX8',
    keywords: ['step-back lunge']
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'Lower Body',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    description: 'A dynamic lunge that involves stepping forward into each repetition, challenging balance and coordination more than a static lunge.',
    instructions: [
      'Stand with feet together.', 
      'Step forward with one foot and lower into a lunge, with both knees at 90-degree angles.', 
      'Push off your back foot and step it forward to meet your front foot.', 
      'Repeat, stepping forward with the opposite leg.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Balance'],
    videoUrl: 'https://www.youtube.com/embed/L8fvypoZc7c'
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'Lower Body',
    difficulty: 'Intermediate',
    equipment: 'dumbbell',
    description: 'A squat variation that emphasizes core stability and an upright torso.',
    instructions: [
      'Hold one dumbbell vertically against your chest with both hands.',
      'Stand with feet slightly wider than shoulder-width.',
      'Perform a squat, keeping the dumbbell close to your body and your back straight.',
      'Drive through your heels to stand back up.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/MeW_P-avd48'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Lower Body',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    description: 'A single-leg squat variation with the rear foot elevated, increasing the challenge on the front leg and improving stability.',
    instructions: [
      'Stand a few feet in front of a bench or chair.', 
      'Place the top of one foot on the bench behind you.', 
      'Lower your hips until your front thigh is parallel to the ground.', 
      'Keep your torso upright and push through your front heel to return to the start.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Balance'],
    videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE',
    keywords: ['rear-foot elevated split squat']
  },
  {
    id: 'assisted-pistol-squat',
    name: 'Pistol Squat (Assisted)',
    category: 'Lower Body',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    description: 'A single-leg squat performed to full depth. This assisted version uses support to help with balance and strength.',
    instructions: [
      'Stand on one leg, holding onto a door frame, pole, or TRX for support.', 
      'Extend the other leg straight out in front of you.', 
      'Lower yourself down into a full squat on the standing leg, using your arms for balance and assistance.', 
      'Push through your heel to return to the starting position.'
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Balance', 'Core'],
    videoUrl: 'https://www.youtube.com/embed/1_4z61g1-kQ',
    keywords: ['single leg squat']
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    equipment: 'bodyweight',
    description: 'A simple but effective isometric exercise that strengthens the entire core, as well as shoulders and glutes.',
    instructions: [
      'Place your forearms on the floor with elbows aligned below shoulders.', 
      'Extend your legs back, resting on your toes.', 
      'Keep your body in a straight line from head to heels, engaging your core and glutes.', 
      'Hold the position without letting your hips sag.'
    ],
    muscleGroups: ['Core', 'Abs', 'Obliques', 'Back'],
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c'
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'Core',
    difficulty: 'Intermediate',
    equipment: 'bodyweight',
    description: 'A dynamic, high-intensity exercise that combines a plank with running knees, targeting the core and elevating heart rate.',
    instructions: [
      'Start in a high plank position with hands under your shoulders.', 
      'Engage your core and bring one knee towards your chest.', 
      'Quickly switch legs, bringing the other knee forward.', 
      'Continue alternating legs at a fast pace as if running in place.'
    ],
    muscleGroups: ['Core', 'Abs', 'Hip Flexors', 'Shoulders'],
    videoUrl: 'https://www.youtube.com/embed/nmwgirg2B5s'
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'Core',
    difficulty: 'Advanced',
    equipment: 'bodyweight',
    description: 'A foundational gymnastics exercise that builds immense core strength and stability by holding a challenging, braced position.',
    instructions: [
      'Lie on your back with your arms and legs extended.', 
      'Simultaneously lift your arms, head, shoulders, and legs off the floor.', 
      'Press your lower back firmly into the ground, creating a "hollow" or banana shape with your body.', 
      'Hold this position, keeping your core tight.'
    ],
    muscleGroups: ['Core', 'Abs', 'Hip Flexors'],
    videoUrl: 'https://www.youtube.com/embed/B43v_j_2S24',
    keywords: ['hollow hold', 'hollow rock']
  },

  // FULL BODY
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'Full Body',
    difficulty: 'Advanced',
    equipment: 'kettlebell',
    description: 'A powerful hip-hinge movement that develops explosive power, strength, and cardio.',
    instructions: [
      'Stand with feet shoulder-width apart, holding the kettlebell with both hands.',
      'Hinge at your hips, allowing the kettlebell to swing back between your legs.',
      'Explosively drive your hips forward to propel the kettlebell up to chest height.',
      'Let gravity bring the kettlebell back down into the next swing.'
    ],
    muscleGroups: ['Glutes', 'Hamstrings', 'Core', 'Back'],
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8'
  }
];