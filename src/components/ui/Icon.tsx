import type { IconProps, IconName } from '../../types';
import {
    AttachIcon,
    SendIcon,
    StopIcon,
    CloseIcon,
    BurgerIcon,
    MessageIcon,
    CopyIcon,
    CheckMarkIcon,
    EditIcon,
    DeleteIcon,
    SearchIcon,
    PlusIcon,
    UserIcon,
    SettingsIcon,
    ErrorIcon,
    AssistantIcon,
    LogoIcon
} from '../icons/Icons';

const iconMap: Record<IconName, React.FC<any>> = {
    attach: AttachIcon,
    send: SendIcon,
    stop: StopIcon,
    burger: BurgerIcon,
    close: CloseIcon,
    checkmark: CheckMarkIcon,
    copy: CopyIcon,
    message: MessageIcon,
    edit: EditIcon,
    delete: DeleteIcon,
    search: SearchIcon,
    plus: PlusIcon,
    user: UserIcon,
    settings: SettingsIcon,
    error: ErrorIcon,
    assistant: AssistantIcon,
    logo: LogoIcon
};

export const Icon = ({ name, size }: IconProps) => {
    const Component = iconMap[name];

    if (!Component) return null;

    return <Component size={size} />;
};