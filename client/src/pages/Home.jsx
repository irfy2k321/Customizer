import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CustomButton } from '../components';
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation,
} from '../config/motion';

const Home = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>            {snap.intro && (                <motion.section className="home bg-[#0a0a0a] text-white max-w-[65%]" {...slideAnimation('left')}>
                    
                    {/* Header remains the same */}
                    <motion.header {...slideAnimation('down')} className="flex justify-between items-center w-full">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <h3 className="text-xl font-light tracking-wider">FABRIC<span className="font-bold">OS</span></h3>
                        </motion.div>
                        <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <div className="h-1 w-10 bg-white"></div>
                            <div className="h-1 w-1 bg-white"></div>
                        </motion.div>
                    </motion.header>

                    {/* Main content area */}
                    <motion.div className="home-content" {...headContainerAnimation}>
                        <motion.div {...headTextAnimation}>
                            <h1 className="text-[8rem] xl:text-[10rem] font-medium tracking-tighter leading-none">
                                FABRIC<br className="xl:block hidden" /><span className="text-[#717171]">FUTURE</span>
                            </h1>
                        </motion.div>
                        <motion.div {...headContentAnimation} className="flex flex-col gap-5 mt-8">
                            <p className="max-w-md font-light text-[#a0a0a0] text-base tracking-wider">
                                Craft your identity with our cutting-edge 3D fabric engineering system.
                                <span className="block mt-3 text-white font-medium">DESIGN • VISUALIZE • EXPERIENCE</span>
                            </p>
                            <div className="mt-8">
                                <CustomButton 
                                    type="filled"
                                    title="ENTER WORKSPACE"
                                    handleClick={() => state.intro = false}
                                    customStyles="px-6 py-3 font-light tracking-widest text-sm border border-white hover:bg-white hover:text-black transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className="fixed bottom-10 right-10 flex gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                    >
                        <div className="text-xs text-[#717171] tracking-wider">© 2025</div>
                        <div className="text-xs text-[#717171] tracking-wider">VERSION 2.0</div>
                    </motion.div>

                </motion.section>
            )}
        </AnimatePresence>
    );
}

export default Home;