import { FC, ReactElement } from "react";

interface Props {
  className?: string;
}

const Navbar: FC<Props> = ({ className = "" }): ReactElement => {
  return <div className={`bg-red-600 ${className}`}>
    
  </div>;
};

export default Navbar;
