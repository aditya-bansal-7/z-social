import { motion } from "framer-motion";

const transition = (OgComponent) => {
  const WrappedComponent = (props) => {
    return (
      <>
        {/* Ensure OgComponent is rendered properly */}
        <OgComponent {...props} />

        {/* Slide-in animation */}
        
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-black slide-in"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Slide-out animation */}
        

        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-black slide-out"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </>
    );
  };

  return WrappedComponent;
};

export default transition;
